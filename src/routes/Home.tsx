import React from 'react';
import ContactUs from '../components/ContactUs'
import styled from 'styled-components'
import ActivityList from '../components/Home/ActivityList'
import Navbar from '../components/Navbar';
import { DisplayLarge } from '../utils/ThemeText';
import { FirebaseUser } from '../types/FirebaseUser';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import CSS from 'csstype'
import AnnouncementList from '../components/Home/AnnouncementList';

type HomeProps = {
    firebaseUserData: FirebaseUser
}

type HomeState = {

}

const height = window.innerHeight;

/*
 * Main page that the users will visit
 */
class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {

        }
    }

    carouselStyle: CSS.Properties = {
        position: 'absolute',
        top: `${(height * 0.1) + 50}px`,
        right: '15vw',
        width: '30vw',
        //left: '20%',
        height: '30vw',
    }

    render = () => {
        const Wrapper = styled.div`
            display: flex;
            flex-direction: column;
            background: #18202B;
            justify-content: center;
            align-items: center;
        `

        const HomeBackground = styled.div`
            justify-content: flex-start;
            display: flex;
            align-items: center;
            width: 100%;
            height: 90vh;
            background: linear-gradient(to bottom, #0B121C 55%, #18202B 35%);
            order: 1;
            padding-left: 15vw;
            padding-top: 5vh;
        `

        const AnnouncementDisplay = styled.div`
            position: absolute;
            top: ${(height * 0.1) + 50}px;
            left: 15vw;
            width: 39vw;
            height: 30vw;
            background: #f2f2f2;
        `

        /* const MainBannerContainer = styled.div`
            display: flex;
            width: 70vw;
            height: 65vh;
            margin: auto;
            align-items: center;
            z-index: 0;
        `
        const MainBanner = styled.div`
            display: flex;
            flex-direction: column;
            position: absolute;
            width: 42%;
            height: 25vh;
            background: white;
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
            box-sizing: border-box;
            padding: 25px 50px;
        `
        const MainBannerImage = styled.img`
            height: auto;
            width: auto;
        ` */

        const Activity = styled.div`
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            bottom: 100%;
            height: 100vh;
            order: 2;
        `
        const ActivityWrapper = styled.section`
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            margin: 0 auto;
            width: 70%;
            justify-content: center;
        `
        const carouselDivStyle: CSS.Properties = {
            height: '30vw',
            zIndex: -1,
        }

        return (
            <Wrapper>
                <Navbar firebaseUserData={this.props.firebaseUserData} />   
                <div style={this.carouselStyle}>
                    <Carousel 
                        dynamicHeight={false} 
                        autoPlay={true} 
                        infiniteLoop={true} 
                        showArrows={false} 
                        showIndicators={true} 
                        showStatus={false} 
                        showThumbs={false}
                    >
                        <div style={carouselDivStyle} onClick={() => window.open('https://www.instagram.com/p/Cfq-wfjLEKH/')}>
                        <img src="https://firebasestorage.googleapis.com/v0/b/nus-kusa-website.appspot.com/o/images%2F%E1%84%89%E1%85%B5%E1%86%AB%E1%84%8B%E1%85%B5%E1%86%B8%E1%84%89%E1%85%A2%E1%86%BC%20%E1%84%83%E1%85%A1%E1%86%AB%E1%84%90%E1%85%A9%E1%86%A8%2022%3A23.jpeg?alt=media&token=7f316dcf-1452-40eb-9e1d-9e34bddf222b" />
                        </div>
                        <div style={carouselDivStyle} onClick={() => window.open('https://www.instagram.com/p/Cfq-wfjLEKH/')}>
                            <img src="https://firebasestorage.googleapis.com/v0/b/nus-kusa-website.appspot.com/o/images%2F%E1%84%89%E1%85%B5%E1%86%AB%E1%84%8B%E1%85%B5%E1%86%B8%E1%84%89%E1%85%A2%E1%86%BC%20%E1%84%83%E1%85%A1%E1%86%AB%E1%84%90%E1%85%A9%E1%86%A8%2022%3A23%20%E1%84%89%E1%85%A5%E1%86%AF%E1%84%86%E1%85%A7%E1%86%BC.jpeg?alt=media&token=2fa74a06-be8f-4dfe-a0cd-e696716b8c1a" />
                        </div>
                    </Carousel>  
                </div>    
                <HomeBackground>
                    <AnnouncementDisplay>
                        <p style={{ margin: '25px', color: '#000000', fontSize: '26px', fontWeight: 'bold'}}>????????????</p>
                        <AnnouncementList postArray={[]} postListArray={[]}></AnnouncementList>
                    </AnnouncementDisplay>
                    
                    {/* <MainBanner>
                        <p style={{ margin: '0', color: '#0B121C', opacity: '0.8', fontSize: '19px', fontWeight: 'bold' }}>
                            Welcome to
                        </p>
                        <DisplayLarge color='#0B121C' style={{ marginTop: '5px', marginBottom: '5px' }}>NUS Korea Society</DisplayLarge>
                        <p style={{ margin: '0', marginBottom: '20px', color: '#0B121C', opacity: '0.5', fontSize: '13px' }}>
                            NUS ?????? ????????? ???????????? ?????? ?????? ???????????????!
                        </p>
                        <GoldenButton to='/about-us'>
                            <DisplayMedium color='white' style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
                                + More Details
                            </DisplayMedium>
                        </GoldenButton>
                    </MainBanner> */}
                </HomeBackground>
                <Activity>
                    <DisplayLarge color='#FFFFFF' style={{ marginLeft: '10px' }}>Our Activities</DisplayLarge>
                    <ActivityWrapper>
                        <ActivityList title='????????????' content='????????? ?????????, ????????????, ????????? ??????' image={'https://firebasestorage.googleapis.com/v0/b/nus-kusa-website.appspot.com/o/source%2Fhome1.png?alt=media&token=61ac81ed-3dff-4f66-a523-2600c4b35203'} />
                        <ActivityList title='?????????' content='???????????? ?????????!' image={'https://firebasestorage.googleapis.com/v0/b/nus-kusa-website.appspot.com/o/source%2Fhome2.png?alt=media&token=58c16a07-4595-4a92-af32-ba519fdf4380'}/>
                        <ActivityList title='???????????? ??????' content='??????, ?????? ?????? ?????????, ?????? ?????? ??????' image={'https://firebasestorage.googleapis.com/v0/b/nus-kusa-website.appspot.com/o/source%2Fhome3.png?alt=media&token=3a7f0efb-dd6d-452d-91e0-3c08adca9c4e'}/>
                    </ActivityWrapper>
                </Activity>
                <ContactUs />
            </Wrapper>
        )
    }
}

export default Home