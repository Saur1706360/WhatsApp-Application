import styled from "styled-components";
import { MdOutlineMessage } from "react-icons/md";
import {AiOutlinePlus} from "react-icons/ai";
import {BsThreeDots} from "react-icons/bs";
import { useState ,useEffect } from "react";
import http from "./httpService";

const Container = styled.div`
  display:flex;
  flex-direction:column;
  height:100%;
  width:100%;
  flex:1.6;
`

const ProfileInfoDiv = styled.div`
   display:flex;
   flex-direction:row;
   background:#ededed;
   padding:10px;

`

const ProfileImage = styled.img`
   width:32px;
   height:32px;
   border-radius:50%;

`
const ProfileBarIcon = styled.div`
   display:flex;
   flex-direction:row;
   padding:5px;
   gap:30px;
   margin-left:auto;

`
const ProfileShowIcon = styled.span`
   font-size: 1.0em;
   cursor:pointer;
   height:20px;
   width:20px;
   border-radius:10px;
   text-align:center;
   :hover{
    background:white;
}

`
const SearchBox = styled.div`
   display:flex;
   background:#f6f6f6;
   padding:10px;

`

export const SearchContainer = styled.div`
    display:flex;
    flex-direction:row;
    background:white;
    border-radius:16px;
    width:100%;
    padding:5px 10px;
`

const SearchIcon = styled.img`
   width:28px;
   height:28px;
`
export const SearchInput = styled.input`
   width:100%;
   outline:none;
   border:none;
   font-size:15px;
   margin-left:10px;
`

const ContactItem = styled.div`
    display:flex;
    flex-direction:row;
    border-bottom:1px solid #f2f2f2; 
    background:white;
    cursor: pointer;
    padding:12px 15px;
    :hover{
        background:#ebebeb;
    }
`;

const ProfileIcon = styled(ProfileImage)`
    width:38px;
    height:38px;

`;

const ContactInfo = styled.div`
    display:flex;
    flex-direction:column;
    width:100%;
    margin:0 12px;
`;

const ContactName = styled.span`
    font-size:16px;
    color:black;
    width:100%;
`;

const MessageText = styled.span`
    font-size:14px;
    width:100%;
    margin-top:3px;
    color:rgba(0,0,0,0.8);
`;

const MessageTime = styled.span`
    font-size:12px;
    margin-right:10px;
    color:rgba(0,0,0,0.45);
    white-space:nowrap;
`;

const ContactComponent = (props)=>{
    const {userData,setChat} = props;
    return <ContactItem onClick={()=>setChat(userData)}>
        <ProfileIcon src={userData.profilePic}/>
        <ContactInfo>
          <ContactName>{userData.name}</ContactName>
          <MessageText>{userData?.lastText}</MessageText>
        </ContactInfo>
        <MessageTime>{userData?.lastTextTime}</MessageTime>
    </ContactItem>;
}

const ContactListComponent = (props)=>{

    const [contactList, setContactList] = useState([]);

    const getData = async () => {
        const { data } = await http.get(`https://my-whatsapp-server-1.herokuapp.com/svr/contactlist`);
        setContactList(data);
      };

    useEffect(() => {
        getData();
    }, []);

 return <Container>
    <ProfileInfoDiv>
        <ProfileImage src="https://img.freepik.com/free-photo/close-up-young-successful-man-smiling-camera-standing-casual-outfit-against-blue-background_1258-66609.jpg?w=2000"/>
        <ProfileBarIcon>
            <ProfileShowIcon><MdOutlineMessage/></ProfileShowIcon>
            <ProfileShowIcon><AiOutlinePlus/></ProfileShowIcon>
            <ProfileShowIcon><BsThreeDots/></ProfileShowIcon>
        </ProfileBarIcon>    
    </ProfileInfoDiv>
    <SearchBox>
         <SearchContainer>
            <SearchIcon src={"search-icon.svg"}/>
            <SearchInput placeholder="Search or new chat start"/>
         </SearchContainer>
    </SearchBox>
    {contactList.map((userData,index)=><ContactComponent userData = {userData} setChat = {props.setChat} key={index}/>)}
 </Container>;
}
export default ContactListComponent;