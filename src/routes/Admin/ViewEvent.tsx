import React from 'react';
import { Thumbs } from 'react-responsive-carousel';
import styled from 'styled-components'
import Navbar from '../../components/Admin/Navbar';
import { FirebaseUser } from '../../types/FirebaseUser';
import { dbService } from '../../utils/firebaseFunctions';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
`
const Table = styled.table`
`
const Header = styled.th`
    border-bottom: 1px solid white;
    border-right: 1px solid white;
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
`
const Row = styled.tr`
`
const Cell = styled.td`
    border-bottom: 1px solid white;
    border-right: 1px solid white;
    text-align: center;
    padding: 10px;
`
const ToCsvButton = styled.button`
    padding: 10px;
    margin-top: 10px;
`

type ViewEventState = {
    rows: any[],
    columns: any[],
}

type ViewEventProps = {
    firebaseUserData: FirebaseUser,
    eventId: string,
}

class ViewEvent extends React.Component<ViewEventProps, ViewEventState> {
    constructor(props: ViewEventProps) {
        super(props);
        this.state = {
            rows: [],
            columns: [],
        }
    }

    componentDidMount() {
        const urls = window.location.href.split("/")
        const rows: any[] = [];
        let columns: any[] = [];
        dbService.collection("events").doc(this.props.eventId).collection("registrations").get().then(docs => {
            docs.forEach(registration => {
                const data = registration.data();
                const response = JSON.parse(data.responseData);
                const user = JSON.parse(data.userData)
                const userKeys = Object.keys(user)
                const responseKeys = Object.keys(response)
                columns = userKeys.concat(responseKeys);
                const finalData = {} as any;
                for (let i = 0; i < userKeys.length; i++) {
                    finalData[userKeys[i]] = user[userKeys[i]];
                }
                for (let i = 0; i < responseKeys.length; i++) {
                    finalData[responseKeys[i]] = response[responseKeys[i]];
                }
                rows.push(finalData)
            })
            console.log(rows)
            console.log(columns)
            this.setState({
                rows: rows,
                columns: columns,
            })
        })
    }

    toCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += this.state.columns.join(",") + "\r\n";
        this.state.rows.forEach(row => {
            let tempArr = this.objectToArray(row);
            csvContent += tempArr.join(",") + "\r\n";
        })
        const encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
    }

    objectToArray = (object: any) => {
        const columns = Object.keys(object);
        let arr = [];
        for (let i = 0 ; i < columns.length; i++) {
            arr.push(object[columns[i]]);
        }
        return arr;
    }   

    render = () => {
        return (
            <Wrapper>
                <Navbar firebaseUserData={this.props.firebaseUserData}/>
                <Container>
                    <Table>
                        <Row>
                            {this.state.columns.map(column => {
                                return <Header>{column}</Header>
                            })}
                        </Row>
                        {this.state.rows.map(row => {
                            return (<Row>
                                {this.state.columns.map(column => {
                                    return (<Cell>
                                        {typeof row[column] == "boolean" ? row[column] == true ? "Yes" : "No" : row[column]} 
                                    </Cell>)
                                })}
                            </Row>)
                        })}
                    </Table>
                    <ToCsvButton onClick={this.toCSV}>Download CSV</ToCsvButton>
                </Container>
            </Wrapper>
        )
    }
}

export default ViewEvent;