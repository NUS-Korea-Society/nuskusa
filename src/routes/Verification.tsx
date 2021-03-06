import React from 'react'
import Navbar from '../components/Navbar'
import VerificationComponent from '../components/Verification/VerificationComponent'
import { FirebaseUser } from '../types/FirebaseUser'
import { FirestoreUserVerification } from '../types/FirestoreUserVerification'
import { authService, dbService } from '../utils/firebaseFunctions'

type VerificationProps = {
    firebaseUserData: FirebaseUser
}

type VerificationState = {
    verificationComponentArray: any[],
    verificationId: string
}

class Verification extends React.Component<VerificationProps, VerificationState> {
    constructor(props: any) {
        super(props)
        this.state = {
            verificationComponentArray: [],
            verificationId: ''
        }
    }

    componentDidMount = () => {
        this.fecthVerificationCollection();
    }

    fecthVerificationCollection = () => {
        if (authService.currentUser) {
            dbService
                .collection('verifications')
                .onSnapshot((querySnapshot: { empty: any; docs: any[] }) => {
                    if (!querySnapshot.empty) {
                        const arr = querySnapshot.docs.map((element: { data: () => FirestoreUserVerification; id: string }) => {
                            const data = element.data() as FirestoreUserVerification
                            return (
                                <VerificationComponent
                                    key={element.id}
                                    verificationId={element.id}
                                    firestoreVerificationData={data}
                                />
                            )
                        })
                        this.setState({
                            verificationComponentArray: arr,
                        })
                    }
                })
        }
    }

    render = () => {
        return (
            <>
                <Navbar firebaseUserData={this.props.firebaseUserData} />
                {this.props.firebaseUserData.role.toLowerCase() === 'admin' ?
                    <div>
                        You are an administrator. <br />
                        1. ????????? ?????? ??????, ????????????, ??? ?????? <br />
                        2. ????????? ????????? ?????????/?????? ?????????/?????? ????????? ?????? ????????? ?????? <br />
                        3. ?????? ?????? ?????? Accept??????. ????????? ????????? ????????? ?????? Reject?????? <br />
                        {this.state.verificationComponentArray}
                    </div>
                    :
                    <div>
                        Only Admins can view this page.
                    </div>
                }
            </>
        )
    }
}

export default Verification;