import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./ChatLogics";
// import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  // const { user } = ChatState();
  const userString = localStorage.getItem("userLoginInfo");
const userLogin = userString ? JSON.parse(userString) : null;
const Token = userLogin && userLogin.token ? userLogin.token : null; 
const loggedinuserId = userLogin && userLogin.user ? userLogin.user._id : null; 

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, loggedinuserId) ||
              isLastMessage(messages, i, loggedinuserId)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  // name={m.sender.name}
                  // src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === loggedinuserId ? "#E43270" : "#3FD1CE"
                }`,
                color:"black",
                marginLeft: isSameSenderMargin(messages, m, i, loggedinuserId),
                marginTop: isSameUser(messages, m, i, loggedinuserId) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
