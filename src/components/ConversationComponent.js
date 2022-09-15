import styled from "styled-components";
import { SearchContainer, SearchInput } from "./ContactListComponent";
import Picker from "emoji-picker-react";
import { useState,useEffect } from "react";
import {AiOutlineCheck} from "react-icons/ai";
import http from "./httpService";

const Container = styled.div`
  display:flex;
  flex-direction:column;
  height:100%;
  flex:3;
  background: #f6f7f8;
`
const ProfileHeader = styled.div`
  display:flex;
  flex-direction:row;
  background:#ededed;
  padding:9px;
  align-items:center;
  gap:10px;
`
const ProfileImage = styled.img`
   width:32px;
   height:32px;
   border-radius:50%;

`
const ProfileDetails = styled.div`
    display:flex;
    flex-direction:column;
    padding:0px;
`
const ProfileName = styled.span`
    display:flex;
    flex-direction:row;
    font-size:15px;
`
const ProfileStatus = styled.span`
    font-size:10px;
`
const ChatBox = styled.div`
    display:flex;
    background:#f0f0f0;
    padding:10px;
    align-items:center;
    bottom:0;

`
const EmojiImage = styled.img`
    width:28px;
    height:28px;
    opacity:0.4;
    cursor:pointer;
`

const MessageContainer = styled.div`
   padding:20px;
   height:100%;
   background:#e5ddd6;
   display:flex;
   flex-direction:column;
   overflow-y:scroll;
`
const MessageDiv = styled.div`
    justify-content:${props=>props.isYours?"flex-end" : "flex-start"};
    display:flex;
    margin: 10px 15px;
    margin-right:80px;
    margin-left:80px;
    margin-top: auto !important;
`

const Message = styled.div`
     background:${props=>props.isYours?"#daf8cb" : "white"};
     min-width:15%;
     max-width:50%;
     color:#303030;
     padding:8px 10px;
     font-size:14px;
     border-radius:${props=>props.isYours?"15px 0 15px 15px" : "0 15px 15px 15px"};
     position: relative;

     &:before {
      content: '';
      position: absolute;
      visibility: visible;
      top: 0px;
      left: -10px;
      border: 10px solid transparent;
      border-top:${props=>props.isYours ? "" : "10px solid white"};
   }

     &:after {
      content: '';
      position: absolute;
      visibility: visible;
      top: 0px;
      right: -9px;
      border: 10px solid transparent;
      border-top:${props=>props.isYours ? "10px solid #daf8cb" : ""};
      clear: both;
  }
    
`
const MessageStatus = styled.div`
     display:flex;
     flex-direction:row;
     font-size:8px;
     gap:2px;
     float:right;
     margin-top:5px;
`
const MessageTime = styled.span`
     display:flex;
     flex-direction:row;
     font-size:8px;
`
const MessageCheck = styled.span`
    font-size:10px;
    color:blue;
`
const ButtonContainer = styled.div`
     display:flex;
     flex-direction:row;
     margin: 0px 5px;
     align-items:center;
`

const Button = styled.button`
    display:flex;
    height:36px;
    width:36px;
    background-color:#ece5dd;
    border-radius:20px;
    align-items:center;
    border:none;
    cursor:pointer;
`
const ButtonImage = styled.img`
    height:20px;
    width:20px;
    margin: 1px 2px;
`

const ConversationComponent = (props)=>{
    const {selectedChat} = props;
    const [text,setText] = useState("");
    const [pickerVisible,togglePicker] = useState(false);
    const [messageList,setMessageList] = useState([]);
    
    const onEmojiClick = (event,emojiObj)=>{
      setText(text+emojiObj.emoji);
      togglePicker(false);
    }

    const getData = async () => {
      const { data } = await http.get(`https://my-whatsapp-server-1.herokuapp.com/svr/messagelist`);
      console.log(data);
      setMessageList(data);
    };

    useEffect(() => {
        getData();
    }, []);


    const onEnterPress = async(event)=>{
      if(event.key === "Enter"){
        const time = getTime();
        let response = await http.post("https://my-whatsapp-server-1.herokuapp.com/svr/postMessage",{
          id: selectedChat.id,
          messageType: "TEXT",
          text:text,
          senderID: 0,
          addedOn: time,
        });
        let {data} = response;
        console.log(data);
        setMessageList(data);
       setText("");
      }
    }
    const getTime = ()=>{
      let d = new Date();
      let str = d.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
      return str;
    }
    const handleSend = async()=>{
      const time = getTime();
        let response = await http.post("https://my-whatsapp-server-1.herokuapp.com/svr/postMessage",{
          id: selectedChat.id,
          messageType: "TEXT",
          text:text,
          senderID: 0,
          addedOn: time,
        });
        let {data} = response;
        console.log(data);
        setMessageList(data);
       setText("");
    }
    return <Container>
          <ProfileHeader>
            <ProfileImage src={selectedChat.profilePic}/>
            <ProfileDetails>
               <ProfileName>{selectedChat.name}</ProfileName>
               <ProfileStatus>{selectedChat.status}</ProfileStatus>
            </ProfileDetails>
          </ProfileHeader>
        <MessageContainer>
            {
            messageList.map((messageData,index)=>
              messageData.id === selectedChat.id &&<MessageDiv isYours = {messageData.senderID === 0} key={index}>
                    <Message isYours = {messageData.senderID === 0}>
                        {messageData.text}<br/>
                        <MessageStatus>
                           <MessageTime>{messageData.addedOn}</MessageTime>
                           {messageData.senderID === 0 ? <MessageCheck><AiOutlineCheck/></MessageCheck> : ""}
                        </MessageStatus>
                    </Message>
                </MessageDiv>
                
              )          
            }
        </MessageContainer>
        <ChatBox>
           <SearchContainer>
              {
                pickerVisible && <Picker 
                    pickerStyle={{position:"absolute",bottom:"60px"}}
                    onEmojiClick={onEmojiClick}
                />
              }
              <EmojiImage src={"/data.svg"} onClick={()=>togglePicker(!pickerVisible)}/>
              <SearchInput 
               placeholder="Type a message" 
               value={text} 
               onKeyDown = {onEnterPress}
               onChange={(e)=>setText(e.target.value)}/>
           </SearchContainer>
          <ButtonContainer>{text ? <Button onClick={()=>handleSend()}><ButtonImage src="send.png"/></Button> : <Button><ButtonImage src="https://cdn1.iconfinder.com/data/icons/material-audio-video/21/mic-512.png"/></Button>}</ButtonContainer>
        </ChatBox>
        </Container>;
   }
   export default ConversationComponent;