import React from 'react';
import styled from 'styled-components'
import TextInput from "./TextInput"
import Checkbox from './Checkbox'
import { FirebaseUser } from '../../types/FirebaseUser'
import { dbService } from '../../utils/firebaseFunctions';
import crypto from 'crypto-js'

const margin = 20;

const Wrapper = styled.div`
    width: 70%;
    font-weight: 800;
    font-size: 13px;
    order: 2;
    word-wrap: break-word;
    overflow: scroll;
    line-height: 29px;
`
const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
`
const Description = styled.p`
    font-size: 15px;
    word-break: keep-all;
    white-space: pre-wrap;
`
const Submit = styled.button`
    width: 120px;
    height: 50px;
    background-color: #BDA06D;
    font-weight: 700;
    font-size: 15px;
    color: white;
    margin-top: 30px;
`
const LoadingBlocker = styled.div`
    opacity: 0.5;
    background-color: black;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`
const LoadingText = styled.span`
    background-color: black;
    color: white;
    font-size: 16px;
    font-weight: 600;
`

type EventProps = {
    data: string,
    firebaseUserData: FirebaseUser,
    title: string,
}

type EventState = {
    data: any,
    inputs: any[],
    mounted: boolean,
    loading: boolean,
}

class Event extends React.Component<EventProps, EventState> {
    constructor(props: EventProps) {
        super(props);
        this.state = {
            data: JSON.parse('{}'),
            inputs: [],
            mounted: false,
            loading: false,
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount = () => {
        if (this.props.data != "Content") {
            this.setState({
                data: JSON.parse(this.props.data)
            })
        }
    }

    static getDerivedStateFromProps = (newProps: EventProps, prevState: EventState) => {
        if (! prevState.mounted && newProps.data != "Content") {
            const newData = JSON.parse(newProps.data);
            const inputArray = [];
            for (let i = 0; i < newData.questions.length; i++) {
                inputArray.push("");
            }
            return {
                data: JSON.parse(newProps.data),
                inputs: inputArray,
                mounted: true,
            }
        }
        
    }

    handleChange = (index: number, content: any) => {
        const temp = [];
        for (let i = 0; i < this.state.inputs.length; i++) {
            temp.push(this.state.inputs[i])
        }
        temp[index] = content;
        this.setState({
            inputs: temp,
        }, () => console.log(this.state.inputs))
    }

    handleSubmit = (event: any) => {
        event.preventDefault();
        let already = false;
        window.confirm("????????? ????????? ?????? 1?????? ???????????? ?????? ????????? ?????? ????????? ???????????? ??????????????? ?????? ????????? ??? ??????????????????. ???????????? ???????????? ?????????????????????????")
        const hashedTitle = crypto.SHA256(this.props.title).toString().substring(0,20);
        dbService.collection("events").doc(hashedTitle).collection("registrations").doc(this.props.firebaseUserData.userId).get().then(doc => {
            this.setState({
                loading: true,
            })
            if (doc.exists) {
                window.alert("?????? ???????????? ??????????????????.")
                this.setState({
                    loading: false
                })
                already = true;
            }
        }).then(() => {
            if (! already) {
                const responseData: any = {}
                for (let i = 0; i < this.state.inputs.length; i++) {
                    const question = this.state.data.questions[i].question
                    responseData[question] = this.state.inputs[i]
                }
                const finalData = {
                    userData: JSON.stringify(this.props.firebaseUserData),
                    responseData: JSON.stringify(responseData),
                }
                dbService.collection("events").doc(hashedTitle).collection("registrations").doc(this.props.firebaseUserData.userId).set(finalData).then(() => {
                    window.alert("????????? ????????? ??????????????? ?????????????????????. ?????????????????? ???????????????.")
                    this.setState({
                        loading: false,
                    })
                }).catch(err => {
                    console.log(err.message)
                    window.alert("????????? ????????? ??????????????????. ????????? ?????? ??????????????????. ????????????:" + err)
                    this.setState({
                        loading: false,
                    })
                })
            }
        })
    }

    render = () => {
        return (
            <>
                {this.state.loading ? <LoadingBlocker><LoadingText>?????? ??? ?????????! ????????? ?????????????????? : </LoadingText></LoadingBlocker> : <></>}
                <Wrapper>
                    <Form>
                        <Description>{this.state.data.description}</Description>
                        {this.state.data.questions.map((element: any, index: number) => {
                            if (element.type == "text") {
                                return <TextInput question={element.question} handleChange={this.handleChange} index={index} />
                            }
                            else if (element.type == "checkbox") {
                                return <Checkbox question={element.question} handleChange={this.handleChange} index={index} />
                            }
                        })}
                        <Submit onClick={this.handleSubmit}>??????</Submit>
                    </Form>
                </Wrapper>
            </>
        )
    }
}

export default Event;