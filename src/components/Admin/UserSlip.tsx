import React from 'react';
import styled from 'styled-components'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { dbService } from '../../utils/firebaseFunctions';

const width = window.innerWidth;
const height = window.innerHeight;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    background: #18202B;
    justify-content: center;
    align-items: center;
    width: 60vw;
    padding-top: 10px;
    padding-bottom: 10px;
`
const TopBlock = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-bottom: 10px;
`
const Name = styled.span`
    color: white;
    font-size: 22px;
    font-weight: 600;
`
const UserType = styled.span`
    color: #BDBDBD;
    font-size: 16px;
    margin-left: auto;
`
const BottomBlock = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`
const Profile = styled.div`
    display: flex;
    flex-direction: column;
    width: 60%;
`
const InfoSlip = styled.span`
    width: 100%;
    color: #A6A6A6;
`
const DocLink = styled.a`
    width: 100%;
    text-decoration: underline;
    color: white;
`
const ButtonDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    width: 40%;
`
const Buttons = styled.div`
    display: flex;
    flex-direction: row;
`
const AcceptButton = styled.div`
    padding: 10px;
    padding-left: 30px;
    padding-right: 30px;
    margin: 15px;
    background-color: green;
    cursor: pointer;
`
const DeclineButton = styled.div`
    padding: 10px;
    padding-left: 30px;
    padding-right: 30px;
    margin: 15px;
    margin-right: 0px;
    background-color: red;
    cursor: pointer;
`
type AdminVerificationProps = {
    acceptanceLetterURL: string,
    graduationLetterURL: string,
    email: string,
    role: string,
    userId: string,
    userType: string,
    userName: string,
    gender: string,
    major: string,
    KTId: string,
    setLoading: Function,
    unsetLoading: Function,
}

type AdminVerificationState = {

}

class AdminVerification extends React.Component<AdminVerificationProps, AdminVerificationState> {
    constructor(props: AdminVerificationProps) {
        super(props);
        this.state = {

        }
        this.handleAccept = this.handleAccept.bind(this);
        this.handleDecline = this.handleDecline.bind(this);
    }

    userTypeMap: {[name: string]: string} = {
        'Offered': '?????????',
        'Graduated': '?????????'
    }

    componentDidMount() {
        console.log(this.props)
    }

    handleAccept(event: any) {
        if (! window.confirm(this.props.userName + "?????? ?????????????????????????")) {
            return;
        }
        this.props.setLoading()
        dbService.collection('toVerify').doc(this.props.userId).delete().then(() => {
            dbService.collection('users').doc(this.props.userId).update({
                isVerified: true,
            }).then(async () => {
                this.props.unsetLoading();
                window.alert("??????????????? ?????????????????????.")
            })
        })
    }

    handleDecline(event: any) {
        event.preventDefault();
        if (!window.confirm(this.props.userName + "?????? ??????????????? ?????????????????????????")) {
            return;
        }
        this.props.setLoading();
        dbService.collection('toVerify').doc(this.props.userId).delete().then(async () => {
            this.props.unsetLoading();
            window.alert("??????????????? ?????????????????????. ?????? ???????????? ???????????? ??? ?????? ???????????????! ????????? ??????: " + this.props.email)
        })
    }

    render = () => {
        return (
            <Wrapper>
                <TopBlock>
                    <Name>{this.props.userName}</Name>
                    <UserType>{this.userTypeMap[this.props.userType]}</UserType>
                </TopBlock>
                <BottomBlock>
                    <Profile>
                        <InfoSlip>- ?????????: {this.props.email}</InfoSlip>
                        <InfoSlip>- ??????: {this.props.gender}</InfoSlip>
                        <InfoSlip>- ??????: {this.props.major}</InfoSlip>
                        <InfoSlip>- ???????????? ID: {this.props.KTId}</InfoSlip>
                        {this.props.acceptanceLetterURL ? <DocLink href={this.props.acceptanceLetterURL} target="blank" rel="noreferrer noopener">??????????????? ??????</DocLink>: <></>}
                        {this.props.graduationLetterURL ? <DocLink href={this.props.graduationLetterURL} target="blank" rel="noreferrer noopener">??????????????? ??????</DocLink> : <></>}
                    </Profile>
                    <ButtonDiv>
                        <Buttons>
                            <AcceptButton onClick={this.handleAccept}>??????</AcceptButton>
                            <DeclineButton onClick={this.handleDecline}>??????</DeclineButton>
                        </Buttons>
                    </ButtonDiv>
                </BottomBlock>
            </Wrapper>
        )
    }
}

export default AdminVerification