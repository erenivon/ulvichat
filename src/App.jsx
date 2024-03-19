import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import {
  Box,
  Button,
  Container,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import Message from "./components/Message";
import { app } from "./firebase";
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logoutHandler = () => signOut(auth);

function App() {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const divForScroll = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (message !== "") {
        setMessage("");
        await addDoc(collection(db, "Messages"), {
          text: message,
          uid: user.uid,
          uri: user.photoURL,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });

    const unsubscribeForMessage = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });

    return () => {
      unsubscribe();
      unsubscribeForMessage();
    };
  }, []);

  useEffect(() => {
    if (divForScroll.current) {
      divForScroll.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  return (
    <Box bg={"#202c33"}>
      {user ? (
        <Container h={"100vh"} backgroundColor={"#151d23"}>
          <VStack h="full" paddingY={"4"}>
            <Button onClick={logoutHandler} backgroundColor={"#2a3942"} colorScheme="black" w={"full"}>
              Çıkış Yap 
              <IoIosLogOut width={"20px"}/>
            </Button>

            <VStack
              h="full"
              w={"full"}
              overflowY="auto"
              css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"}
                  text={item.text}
                  uri={item.uri}
                />
              ))}

              <div ref={divForScroll}></div>
            </VStack>

            <form onSubmit={submitHandler} style={{ width: "100%", marginBottom: "20px"}}>
              <HStack>
                <Input 
                  color={"white"}
                  backgroundColor={"#2a3942"}
                  border={"0"}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mesajınızı girin..."
                />
                <Button backgroundColor={"#00a884"} color={"white"} colorScheme={"green"} type="submit">
                  <IoSend />
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack bg="#001c36" justifyContent={"center"} h="100vh">
          <Button onClick={loginHandler} colorScheme={"purple"}>
            Google ile giriş yap
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
