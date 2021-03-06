import React, {useState} from 'react';
import "./OldPoll.css"
import nust from "../../../img/nust.png"
import {MoreHorizontal} from "lucide-react";
import {DropDown} from "../../DropDown/DropDown";
import styled, {keyframes} from "styled-components";
import {fadeIn} from "react-animations";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const FadeIn = styled.div`
  animation: 0.25s ${keyframes(fadeIn)};
`;

function OldPoll(props) {

    const navigate = useNavigate();

    const [listOpen, setListOpen] = useState(false);

    const [name, setName] = useState(props.text);

    async function renameHandler(newName) {
        await axios.post('http://localhost:9000/polls/edit/' + props.id, {poll_name: newName}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {
            console.log(res);
            setName(newName)
        }).catch(error => {
            console.log(error.message);
        })
    }

    function toggleList() {
        setListOpen(!listOpen);
    }

    async function deleteHandler() {
        await axios.delete('http://localhost:9000/polls/delete/' + props.id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {
            console.log(res);
            props.deletePoll(props.id);
        }).catch(error => {
            console.log(error.message);
        })
    }

    function getOnClick() {
        if (props.published) {         //to do something
            localStorage.setItem('pollId', props.id)
            console.log("finalized poll")
            navigate("/create-poll")
        } else {
            localStorage.setItem('pollId', props.id)
            navigate("/create-poll")
        }
    }

    return (
        <div className={"base2"}>

            <div className={"cover"}>

                <img src={nust} onClick={getOnClick} alt={"form-img"}/>
                { !props.published && <p className={"draft-text"} onClick={getOnClick} > Draft </p>}
                <button onClick={toggleList}>
                    <MoreHorizontal color={"#085B91"} strokeWidth={"2"} size={"17"}/>
                </button>
                {listOpen && (
                    <FadeIn><DropDown closeDropDown={toggleList} oldName={props.text} renameHandler={renameHandler}
                                      deleteHandler={deleteHandler}/></FadeIn>)}
            </div>
            <div className={"text"} onClick={getOnClick}>
                <h6>{name}</h6>
                <p>Created On : {new Date(props.date).toLocaleDateString(
                    'en-gb',
                    {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'utc'
                    }
                )}</p>
            </div>
        </div>);
}

export default OldPoll;