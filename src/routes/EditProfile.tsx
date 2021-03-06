import React from 'react';
import Navbar from '../components/Navbar';
import { FirebaseUser } from '../types/FirebaseUser';
import styled from 'styled-components';
import { authService, dbService, storageService } from '../utils/firebaseFunctions'
import firebase from 'firebase';

type EditProfileProps = {
    firebaseUserData: FirebaseUser,
    userId: string
}

type EditProfileState = {
    userData: FirebaseUser,
    profileChanged: boolean,
    verificiationOpen: boolean,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
    emailChange: boolean,
    loading: boolean,
}

const Container = styled.div`
    height: 100%;
    width: 100%;
`
const ProfileContainer = styled.div`
    position: absolute;
    top: 15vh;
    width: 70%;
    left: 15%;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    z-index: 50;
    margin-bottom: 50px;
`
const ImgAndName = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    z-index: 10;
`
const Profile = styled.img`
    width: 15vh;
    height: 15vh;
    margin-top: 20px;
    margin-bottom: 5px;
    z-index: 10;
`
const RemoveProfile = styled.button`
    :hover {
        color: #0B121C;
        background-color: white;
    }

    font-size: 11px;
    background-color: transparent;
    border: 1px solid;
    height: 16px;
    border-radius: 8px;
    color: white;
    margin-bottom: 5px;
    z-index: 10;
`
const ChangeProfile = styled.label`
    :hover {
        color: #0B121C;
        background-color: white;
    }

    font-size: 11px;
    background-color: transparent;
    border: 1px solid;
    height: 16px;
    border-radius: 8px;
    color: white;
    margin-bottom: 5px;
    padding-left: 5px;
    padding-right: 5px;
    z-index: 10;
`
const Change = styled.input`
    display: none;
    z-index: 10;
`
const Name = styled.span`
    font-size: 30px;
    font-weight: 800;
    z-index: 10;
`
const Email = styled.div`
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    z-index: 10;
`
const EmailText = styled.span`
    margin-left: 10%;
    font-size: 17px;
    font-weight: 600;
    width: 20%;
    z-index: 10;   
`
const EmailInput = styled.input`
    //width: 60%;
    height: 30px;
    font-weight: 600;
    color: #d9d9d9;
    z-index: 10;
    background-color: transparent;
    opacity: 0.85;
    margin-right: 15px;
    line-height: 30px;
    border: 1px solid white;
`
const EmailButton = styled.div`
    width: 150px;
    height: 35px;
    background-color: #0B121C;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: 1px solid white;
`
const EmailButonText = styled.span`
    text-align: center;
    line-height: 35px;
    font-size: 14px;
    color: white;
`
const Major = styled.div`
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    z-index: 10;
`
const MajorText = styled.span`
    margin-left: 10%;
    font-size: 17px;
    font-weight: 600;
    width: 20%;
    z-index: 10;
`
const MajorInput = styled.input`
    width: 50%;
    height: 30px;
    color: #d9d9d9;
    z-index: 10;
    background-color: transparent;
    border: 1px solid white;
    margin-right: 10px;
`
const MajorButton = styled.button`
    width: 10%;
    padding-top: 1px;
    padding-bottom: 1px;
    color: white;
    background-color: transparent;
    border: 1px solid white;
    cursor: pointer;
    
    :hover {
        background-color: white;
        color: #0b121c;
    }
`
const EnrolledYear = styled.div`
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    z-index: 10;
`
const EnrolledYearText = styled.span`
    margin-left: 10%;
    font-size: 17px;
    font-weight: 600;
    width: 20%;
    z-index: 10;
`
const EnrolledYearInput = styled.span`
    margin-bottom: 20px;
    color: #d9d9d9;
    z-index: 10;
`
const Password = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 25px;
`
const PasswordText = styled.span`
    margin-left: 10%;
    font-size: 17px;
    font-weight: 600;
    width: 20%;
    z-index: 10;
`
const PasswordInputs = styled.div`
    display: flex;
    flex-direction: column;
    width: 60%;
`
const OrigPassword = styled.input`
    font-size: 15px;
    height: 25px;
    margin-bottom: 10px;
    font-weight: 600;
`
const NewPassword = styled.input`
    margin-bottom: 10px;   
    font-weight: 600; 
    font-size: 15px;
    height: 25px;
`
const ConfirmPassword = styled.input`
    margin-bottom: 10px;  
    font-weight: 600;
    font-size: 15px;
    height: 25px;
`
const PasswordButton = styled.button`
    :hover {
        color: #cccccc;
    }

    width: 200px;
    height: 50px;
    background-color: #BDA06D;
    font-size: 15px;
    font-weight: 800;
    color: white;
    border: none;
    cursor: pointer;
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
    z-index: 100000;
`
const LoadingText = styled.span`
    background-color: black;
    color: white;
    font-size: 16px;
    font-weight: 600;
    z-index: 99999;
`
class EditProfile extends React.Component<EditProfileProps, EditProfileState> {

    private inputRef: React.RefObject<HTMLInputElement>

    constructor(props: any) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            userData: {
                username: "username",
                userId: "",
                email: "tempEmail@u.nus.edu",
                verificationFile: undefined,
                isVerified: false,
                role: 'User',
                enrolledYear: undefined,
                major: undefined,
                faculty: undefined,
                profilePictureURL: undefined,
                yob: "",
                gender: "",
            },
            profileChanged: false,
            verificiationOpen: false,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            emailChange: false,
            loading: false,
        }
    }

    componentDidMount = () => {
        let canChangeEmail = false;
        if (this.props.firebaseUserData.role == "Offered" && authService.currentUser?.email?.split("@")[1] != "u.nus.edu") {
            canChangeEmail = true;
        }
        this.setState({
            userData: this.props.firebaseUserData,
            emailChange: canChangeEmail,
        })
    }

    componentDidUpdate = () => {
        if (!authService.currentUser) {
            window.location.href = window.location.origin + '/#/';
        }
    }

    static getDerivedStateFromProps = (newProps: any, prevState: any) => {
        if (!authService.currentUser) {
            window.location.href = window.location.origin + '/#/';
        }
        let canChangeEmail = false;
        if (newProps.firebaseUserData.role == "Offered" && authService.currentUser?.email?.split("@")[1] != "u.nus.edu") {
            canChangeEmail = true;
        }
        console.log(newProps.firebaseUserData.role)
        console.log(newProps.firebaseUserData.email.split("@")[1])
        console.log(canChangeEmail)
        return {
            userData: newProps.firebaseUserData,
            emailChange: canChangeEmail,
        }
    }

    render = () => {
        const defaultProfile = 'https://firebasestorage.googleapis.com/v0/b/nus-kusa-website.appspot.com/o/source%2Fprofile_default.png?alt=media&token=61ab872f-8f29-4d50-b22e-9342e0581fb5'

        const handleRemoveProfile = (e: any) => {
            e.preventDefault();

            if (window.confirm("This will remove your profile image and replace with default counterpart. Continue? \n 기존의 프로필 이미지를 삭제하고 기본 프로필 이미지로 대체합니다. 계속하시겠습니까?")) {
                this.setState({
                    loading: true,
                })
                const currentProfile = this.state.userData;
                currentProfile.profilePictureURL = 'undefined';

                dbService.collection('users').doc(this.props.userId).update({ profilePictureURL: 'undefined' }).then(() => {
                    this.setState({
                        userData: currentProfile,
                        profileChanged: false,
                        loading: false,
                    })
                })
            }
        }

        const handleEmailChangeClick = (e: any) => {
            if (this.state.userData.email.split("@")[1] != "u.nus.edu") {
                window.alert("@u.nus.edu로 끝나는 NUS 이메일이 아닙니다. 다시 입력해주세요.")
                let tempProfile = this.state.userData;
                if (authService.currentUser?.email) {
                    tempProfile.email = authService.currentUser?.email
                }
                this.setState({
                    userData: tempProfile,
                })
                return;
            }
            this.setState({
                loading: true,
            })
            authService.currentUser?.updateEmail(this.state.userData.email).catch(err => {
                window.alert("이메일 변경을 실패했습니다.");
                console.log(err);
                this.setState({
                    loading: false,
                })
            }).then(() => {
                authService.currentUser?.sendEmailVerification().catch(err => {
                    window.alert("인증 이메일을 보내지 못했습니다.")
                    console.log(err);
                }).then(() => {
                    dbService.collection('users').doc(authService.currentUser?.uid).update({
                        email: this.state.userData.email,
                        role: 'Current'
                    }).then(() => {
                        window.alert("이메일 변경이 성공적으로 완료되었습니다. 입력하신 이메일로 인증 메일을 보내드렸습니다. 메일의 링크를 눌러 이메일 주소를 인증해주세요! 재학생으로 처리됩니다.");
                        this.setState({
                            loading: false,
                        })
                        authService.signOut();
                        window.location.href = "/#/"
                    })
                })
            })
        }

        const handleEmailChange = (e: any) => {
            e.preventDefault();
            const temp = this.state.userData
            temp.email = e.target.value;
            this.setState({
                userData: temp,
            })
        }

        const handleImageUpload = (e: any) => {
            e.preventDefault();
            this.setState({
                loading: true,
            })
            const target = e.target;
            const profile = this.state.userData;

            const file = target.files[0];
            profile.profilePictureURL = file;
            let type = null;

            if (file.type === 'image/png') {
                type = '.png'
            }
            else if (file.type === 'image/jpeg') {
                type = '.jpeg'
            }
            else {
                type = '.gif'
            }

            storageService.ref('users/' + this.props.userId + type).put(file).then(snapshot => {
                snapshot.ref.getDownloadURL().then(url => {
                    dbService.collection('users').doc(this.props.userId).update({
                        profilePictureURL: url
                    }).then(snapshot => {
                        this.setState({
                            profileChanged: true,
                            userData: profile,
                            loading: false,
                        })
                        window.alert("Profile image is successfully changed! 프로필 사진을 성공적으로 바꾸었어요!")
                    }).catch(err => {
                        window.alert('Profile image change was unsuccessful. Please try again later. 프로필 사진을 바꾸지 못했어요. 나중에 다시 시도해주세요.')
                        this.setState({
                            loading: false,
                        })
                    })
                }).catch(err => {
                    window.alert('Profile image change was unsuccessful. Please try again later. 프로필 사진을 바꾸지 못했어요. 나중에 다시 시도해주세요.')
                    this.setState({
                        loading: false,
                    })
                });
            }).catch(err => {
                window.alert('Profile image change was unsuccessful. Please try again later. 프로필 사진을 바꾸지 못했어요. 나중에 다시 시도해주세요.')
                this.setState({
                    loading: false,
                })
            })
        }

        const handleCurrentPasswordChange = (e: any) => {
            this.setState({
                currentPassword: e.target.value
            })
        }

        const handleNewPasswordChange = (e: any) => {
            this.setState({
                newPassword: e.target.value,
            })
        }

        const handleConfirmNewPasswordChange = (e: any) => {
            this.setState({
                confirmNewPassword: e.target.value
            })
        }

        const handlePasswordChange = (e: any) => {
            if (this.state.confirmNewPassword != this.state.newPassword) {
                window.alert('New password and Confirm password does not match. Please check again. \n\n 새 비밀번호와 비밀번호 확인이 일치하지 않습니다. 확인 바랍니다.')
                return;
            }

            const user = authService.currentUser;

            if (typeof user?.email != 'string') {
                window.alert("Please wait a few seconds and try again.")
                return;
            }

            this.setState({
                loading: true,
            })

            const credential = firebase.auth.EmailAuthProvider.credential(user?.email, this.state.currentPassword)
            user?.reauthenticateWithCredential(credential).then((newCredential) => {
                const newPassword = this.state.newPassword;

                user?.updatePassword(newPassword).then(() => {
                    window.alert("Password was updated successfully")
                    this.setState({
                        loading: false,
                    })
                    return;
                }).catch(error => {
                    window.alert("An error occurred. Please try again")
                    this.setState({
                        loading: false,
                    })
                    return;
                })

            }).catch(error => {
                window.alert("An unknown error occurred during confirming current password.")
                this.setState({
                    loading: false,
                })
                return;
            })

        }

        const handleMajorInputChange = (e: any) => {
            e.preventDefault();
            const temp = this.state.userData
            temp.major = e.target.value;
            this.setState({
                userData: temp,
            })
        }

        const handleMajorChangeSubmit = (e: any) => {
            e.preventDefault();
            this.setState({
                loading: true,
            })
            dbService.collection('users').doc(this.props.firebaseUserData.userId).update({
                major: this.state.userData.major,
            }).then(() => {
                this.setState({
                    loading: false,
                })
                window.alert("학과를 변경했습니다. ")
            })
        }

        return (
            <>
                {this.state.loading ? <LoadingBlocker><LoadingText>거의 다 됐어요! 조금만 기다려주세요 :)</LoadingText></LoadingBlocker> : <></>}
                <Container>
                    <Navbar firebaseUserData={this.props.firebaseUserData} />
                    <ProfileContainer>
                        <ImgAndName>
                            <Profile src={this.state.profileChanged ? this.props.firebaseUserData.profilePictureURL : this.props.firebaseUserData.profilePictureURL === 'undefined' || this.props.firebaseUserData.profilePictureURL === "" || this.props.firebaseUserData.profilePictureURL === undefined ? defaultProfile : this.props.firebaseUserData.profilePictureURL}></Profile>
                            <RemoveProfile onClick={handleRemoveProfile}>Remove Profile Image</RemoveProfile>
                            <ChangeProfile htmlFor="profile-upload"><Change id={'profile-upload'} onChange={handleImageUpload} type='file' accept="image/png, image/gif, image/jpeg" />Change Profile Image</ChangeProfile>
                            <Name>{this.props.firebaseUserData.username}</Name>
                        </ImgAndName>
                        <Email>
                            <EmailText>이메일 / Email</EmailText>
                            <EmailInput value={this.props.firebaseUserData.email} onChange={handleEmailChange} disabled={!this.state.emailChange} ref={this.inputRef} />
                            {this.state.emailChange ? <EmailButton onClick={handleEmailChangeClick}><EmailButonText>NUS Email로 변경하기</EmailButonText></EmailButton> : <></>}
                        </Email>
                        <Major>
                            <MajorText>Major / 전공</MajorText>
                            <MajorInput value={this.props.firebaseUserData.major === undefined ? 'N/A. Verify account to register major.' : this.props.firebaseUserData.major} onChange={handleMajorInputChange} disabled={this.props.firebaseUserData.role == 'Graduate' || this.props.firebaseUserData.role == "Registered"}></MajorInput>
                            <MajorButton onClick={handleMajorChangeSubmit}>Apply</MajorButton>
                        </Major>
                        <EnrolledYear>
                            <EnrolledYearText>Enrolled Year / 입학년도</EnrolledYearText>
                            <EnrolledYearInput>{this.props.firebaseUserData.enrolledYear === undefined ? 'N/A. Verify account to register enrolled year.' : this.props.firebaseUserData.enrolledYear}</EnrolledYearInput>
                        </EnrolledYear>
                        <EnrolledYear>
                            <EnrolledYearText>Year of Birth / 출생년도</EnrolledYearText>
                            <EnrolledYearInput>{this.props.firebaseUserData.yob === undefined ? 'N/A. Verify account to register enrolled year.' : this.props.firebaseUserData.yob}</EnrolledYearInput>
                        </EnrolledYear>
                        <EnrolledYear>
                            <EnrolledYearText>Gender / 성별</EnrolledYearText>
                            <EnrolledYearInput>{this.props.firebaseUserData.gender === undefined ? 'N/A. Verify account to register enrolled year.' : this.props.firebaseUserData.gender}</EnrolledYearInput>
                        </EnrolledYear>
                        <Password>
                            <PasswordText>Change Password</PasswordText>
                            <PasswordInputs>
                                <OrigPassword placeholder={'Current Password / 현재 비밀번호'} type={'password'} onBlur={handleCurrentPasswordChange} />
                                <NewPassword placeholder={'New Password  / 새 비밀번호'} type={'password'} onBlur={handleNewPasswordChange} />
                                <ConfirmPassword placeholder={'Confirm New Password / 새 비밀번호 확인'} type={'password'} onBlur={handleConfirmNewPasswordChange} />
                                <PasswordButton onClick={handlePasswordChange}>Update Password</PasswordButton>
                            </PasswordInputs>
                        </Password>
                    </ProfileContainer>
                </Container>
            </>
        )
    }
}

export default EditProfile;
