import styled from "styled-components";
import { SearchContainer, SearchInput } from "./ContactListComponent";
import Picker from "emoji-picker-react";
import { messagesList } from "../mockData";
import { useState } from "react";
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
   display:flex;
   flex-direction:column;
   height:100%;
   background:#e5ddd6;
   overflow-y:auto;

`
const MessageDiv = styled.div`
    justify-content:${props=>props.isYours?"flex-end" : "flex-start"};
    display:flex;
    margin: 5px 15px;
`

const Message = styled.div`
     background:${props=>props.isYours?"#daf8cb" : "white"};
     max-width:50%;
     color:#303030;
     padding:8px 10px;
     font-size:14px;
     border-radius:5px;
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
    const [messageList,setMessageList] = useState(messagesList);
    const onEmojiClick = (event,emojiObj)=>{
      setText(text+emojiObj.emoji);
      togglePicker(false);
  }
    const onEnterPress = async(event)=>{
      const time = getTime();
      if(event.key === "Enter"){
         const messages = [...messageList];
       if(selectedChat.id === 5){
        let response = await http.post("https://mywhatsapp-server-2.herokuapp.com/svr/getData",{url:`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${text}?unitGroup=metric&include=current&key=DHQ8X23YQARDENJ3M6V89PQRJ&contentType=json`});
        console.log(response);
        let {data} = response;
        let {address,currentConditions} = data;
        let {humidity="",temp="",windspeed="",conditions=""} = currentConditions;
        let str = `Location : ${address} , Temperature : ${temp} , Humidity : ${humidity} , WindSpeed : ${windspeed} , Conditions : ${conditions}`
          messages.push({
            id: selectedChat.id,
            messageType: "TEXT",
            text:text,
            senderID: 0,
            addedOn: time,
          });
          messages.push({
            id: selectedChat.id,
            messageType: "TEXT",
            text:str,
            senderID: 1,
            addedOn: time,
          });
      }
      else{
        messages.push({
          id: selectedChat.id,
          messageType: "TEXT",
          text:text,
          senderID: 0,
          addedOn: time,
        });
      }
       setMessageList(messages);
       setText("");
      }
    }
    const getTime = ()=>{
      let d = new Date();
      let str = d.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
      return str;
    }
    const handleSend = async()=>{
      const messages = [...messageList];
      const time = getTime();
      if(selectedChat.id === 5){
        let response = await http.post("https://mywhatsapp-server-2.herokuapp.com/svr/getData",{url:`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${text}?unitGroup=metric&include=current&key=DHQ8X23YQARDENJ3M6V89PQRJ&contentType=json`});
        console.log(response);
        let {data} = response;
        let {address,currentConditions} = data;
        let {humidity="",temp="",windspeed="",conditions=""} = currentConditions;
        let str = `Location : ${address} , Temperature : ${temp} , Humidity : ${humidity} , WindSpeed : ${windspeed} , Conditions : ${conditions}`
          messages.push({
            id: selectedChat.id,
            messageType: "TEXT",
            text:text,
            senderID: 0,
            addedOn: time,
          });
          messages.push({
            id: selectedChat.id,
            messageType: "TEXT",
            text:str,
            senderID: 1,
            addedOn: time,
          });
      }
      else{
        messages.push({
          id: selectedChat.id,
          messageType: "TEXT",
          text:text,
          senderID: 0,
          addedOn: time,
        });
      }
       setMessageList(messages);
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
            {messageList.map((messageData)=>
              messageData.id ===selectedChat.id && <MessageDiv isYours = {messageData.senderID === 0}>
                    <Message isYours = {messageData.senderID === 0}>
                        {messageData.text}<br/>
                        <MessageStatus>
                           <MessageTime>{messageData.addedOn}</MessageTime>
                           {messageData.senderID === 0 ? <MessageCheck><AiOutlineCheck/></MessageCheck> : ""}
                        </MessageStatus>
                    </Message>
                </MessageDiv>
            )}
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