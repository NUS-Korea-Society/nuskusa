import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import BoardNavbar from '../components/Board/BoardNavbar';
import ContactUs from '../components/ContactUs';
import { GoldenButton } from '../components/GoldenButton';
import Navbar from '../components/Navbar';
import PostThumbnail from '../components/Board/PostThumbnail';
import { dbService } from '../utils/firebaseFunctions';
import { DisplayMedium, DisplayLarge, Headline } from '../utils/ThemeText';
import { FirestorePost } from '../types/FirestorePost';
import { FirestoreBoard } from '../types/FirestoreBoard'
import VerificationRequest from '../components/Verification/VerificationRequest';
import { FirebaseUser } from '../types/FirebaseUser';
import Select from 'react-select';
import { ActionMeta } from 'react-select';
import { generateSamplePost } from '../utils/SamplePost';

type SelectOption = {
    value: string,
    label: string
}

type BoardProps = {
    firebaseUserData: FirebaseUser
    boardId: string,
}

type BoardState = {
    firestoreBoard: FirestoreBoard,
    postArray: FirestorePost[],
    postComponentArray: any[],
    postOrder: SelectOption
}

let prevBoardURL = ""

class Board extends React.Component<BoardProps, BoardState> {
    state: BoardState = {
        firestoreBoard: {
            title: "",
            boardId: "",
            description: "",
            permissions: ["Admin"],
            boardColor: "",
            boardTextColor: "",
            editPermission: [],
        },
        postArray: [],
        postComponentArray: [],
        postOrder: { value: 'lastModified', label: 'Latest' }
    }

    componentDidMount = () => {
        this.fetchBoard();
        this.fetchPosts();

    }

    componentDidUpdate = () => {
        if (prevBoardURL !== this.props.boardId) {
            prevBoardURL = this.props.boardId
            this.fetchBoard();
            this.fetchPosts();
        }
    }

    addPostLink = () => {
        return <button><Link to={`/boards/${this.props.boardId}/new`}></Link></button>
    }

    fetchBoard = () => {
        dbService.collection('boards').doc(this.props.boardId)
            .onSnapshot((doc) => {
                const data = doc.data() as FirestoreBoard
                this.setState({
                    firestoreBoard: {
                        title: data.title,
                        boardId: data.boardId,
                        description: data.description,
                        permissions: data.permissions,
                        boardColor: data.boardColor,
                        boardTextColor: data.boardTextColor,
                        editPermission: data.editPermission,
                    }
                })
            })
    }

    fetchPosts = () => {
        dbService
            .collection('boards').doc(this.props.boardId)
            .collection('posts').orderBy("isPinned", 'desc').orderBy(this.state.postOrder.value, 'desc')
            .onSnapshot((querySnapshot) => {
                const arr: FirestorePost[] = [];
                const componentArray: any[] = [];
                let key = 0
                querySnapshot.docs.forEach((doc) => {
                    key++
                    const data = doc.data() as FirestorePost;
                    const component = (
                        <div key={key}>
                            <PostThumbnail
                                firestorePost={data}
                                firebaseUser={this.props.firebaseUserData}
                                to={`/boards/${this.props.boardId}/${doc.id}`}
                            />
                            {/* Allow to edit all posts in the list */}
                        </div>
                    )
                    arr.push(data);
                    if (data.permissions.includes(this.props.firebaseUserData.role) || data.permissions.includes('User')) {
                        componentArray.push(component)
                    }
                })
                this.setState({
                    postArray: arr,
                    postComponentArray: componentArray
                })
            })
    }

    handleSelectChange = (option: SelectOption | null, actionMeta: ActionMeta<SelectOption>) => {
        this.setState({
            postOrder: option as SelectOption
        })
    }

    render = () => {
        const Container = styled.div`
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #0B121C;
            height: 100%;
            width: 100vw;
        `
        const TextContainer = styled.div`
            display: flex;
            flex-direction: column;
            width: 70vw;
        `
        const PostContainer = styled.div`
            display: flex;
            flex-wrap: wrap;
            width: 70vw;
            height: 100vh;
            box-sizing: border-box;
            overflow-x: hidden;
            overflow-y: scroll;
            margin: auto;
            ::-webkit-scrollbar {
                width: 10px;
            }
            ::-webkit-scrollbar-track {
                max-width: 1px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 5px;
            }
            ::-webkit-scrollbar-thumb {
                width: 10px;
                height: 30px;
                background: white;
                border-radius: 5px;
            }
        `
        const BoardNavbarContainer = styled.div`
            display: flex;
            flex-direction: row;
            width: 70vw;
        `
        const customStyle = {
            valueContainer: (provided: any, state: any) => ({
                ...provided,
                backgroundColor: '#0B121C',
            }),
            option: (provided: any, state: any) => ({
                ...provided,
                backgroundColor: '#18202B',
                color: 'white',
            }),
            control: (provided: any, state: any) => ({
                ...provided,
                width: 'inherit',
                fontSize: '10px',
                backgroundColor: '#0B121C',
                color: 'white',
                borderRadius: '0px',
                border: '1px solid white'
            }),
            singleValue: (provided: any, state: any) => {
                return {
                    ...provided,
                    fontSize: '10px',
                    backgroundColor: '#0B121C',
                    color: 'white'
                };
            },
            menu: (provided: any, state: any) => {
                return {
                    ...provided,
                    backgroundColor: '#18202B',
                    color: 'white',
                    width: 'inherit'
                };
            },
            menuList: (provided: any, state: any) => {
                return {
                    ...provided,
                    backgroundCcolor: '#18202B',
                    color: 'white'
                };
            },
            indicatorSeparator: (provided: any, state: any) => {
                return {
                    ...provided,
                    backgroundColor: '#0B121C',
                    border: 'none'
                }
            }
        }

        return (
            <Container>
                <Navbar firebaseUserData={this.props.firebaseUserData} />
                {!this.props.firebaseUserData.isVerified
                    ?
                    <VerificationRequest firebaseUserData={this.props.firebaseUserData} isModal={true} onClose={() => { }} />
                    :
                    <></>
                }
                <TextContainer>
                    <DisplayLarge color='white' style={{ alignSelf: 'flex-start', marginLeft: '10px', marginBottom: '10px' }}>
                        {this.state.firestoreBoard.title}
                    </DisplayLarge>
                    <Headline color='#FFFFFF' style={{ marginLeft: '10px', marginRight: '10px', opacity: '0.5', overflow: 'clip', width: '40vw' }}>
                        {this.state.firestoreBoard.description}
                    </Headline>
                    {this.state.firestoreBoard.editPermission.includes(this.props.firebaseUserData.role) ?
                        <GoldenButton to={`/boards/${this.props.boardId}/new`} style={{ filter: 'none', marginLeft: '10px', marginBottom: '10px' }}>
                            <Headline color='white' style={{ textAlign: 'center' }}>
                                + 게시글 올리기
                            </Headline>
                        </GoldenButton>
                        :
                        <div />
                    }
                </TextContainer>
                <BoardNavbarContainer>
                    <BoardNavbar currentRoute={this.props.boardId} />
                    <div style={{ margin: 'auto', width: '150px' }}>
                        <Select
                            options={[
                                { value: 'latest', label: 'Latest' },
                                { value: 'upvotes', label: 'Most Popular' }
                            ]}
                            onChange={this.handleSelectChange}
                            styles={customStyle}
                            value={this.state.postOrder}
                        />
                    </div>
                </BoardNavbarContainer>
                
                {this.state.postComponentArray.length === 0 ?
                    <DisplayMedium color='white'>
                        등록된 게시글이 없습니다.
                    </DisplayMedium>
                    :
                    <PostContainer>
                        {this.state.postComponentArray}
                    </PostContainer>
                }

                {this.props.firebaseUserData.role === "Admin" ?
                    <>
                        <button onClick={() => generateSamplePost(
                            dbService.collection("boards").doc(this.props.boardId).collection("posts").doc().id,
                            false,
                            this.props.boardId,
                            this.state.firestoreBoard.title,
                            this.state.firestoreBoard.boardColor,
                            this.state.firestoreBoard.boardTextColor)}>
                            Add Random Post (unpinned)
                        </button>
                        <button onClick={() => generateSamplePost(
                            dbService.collection("boards").doc(this.props.boardId).collection("posts").doc().id,
                            true,
                            this.props.boardId,
                            this.state.firestoreBoard.title,
                            this.state.firestoreBoard.boardColor,
                            this.state.firestoreBoard.boardTextColor)}>
                            Add Random Post (pinned)
                        </button>
                    </>
                    :
                    <></>
                }

                <ContactUs />
            </Container>
        )
    }
}

export default Board;