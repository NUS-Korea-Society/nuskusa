import styled from "styled-components";

const Title = styled.p`
    position: relative;
    text-align: center;
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 42px;
    line-height: 49px;
    text-align: left;

    /* white */
    color: ${props => props.color};
`
const SectionTitle = styled.p`
    margin-left: 10%;
    margin-right: 10%;
    font-size: 20px;
    font-weight: 800;
    word-wrap: break-word;
    box-sizing: border-box;
    text-align: left;
    color: ${props => props.color};
`

const SectionDescription = styled.p`
    margin-left: 10%;
    margin-right: 10%;
    font-size: 14px;
    font-weight: 700;
    word-wrap: break-word;
    box-sizing: border-box;
    text-align: left;
`
const SignInText = styled.p`
    font-weight: 700;
    font-size: 14px;
    color: #FFFFFF;
    margin: 5px;
    padding-left: 1vw;
    padding-right: 1vw;
`
const SignUpText = styled.p`
    font-weight: 700;
    font-size: 14px;    
    color: #101C2C;
    margin: 5px;
    padding-left: 1vw;
    padding-right: 1vw;
`

export { Title, SectionTitle, SectionDescription, SignInText, SignUpText }