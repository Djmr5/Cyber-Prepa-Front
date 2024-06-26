import { useAppContext } from "../../store/appContext/useAppContext";
import { useState, useEffect, useCallback } from 'react';
import { getGamesData } from "./getGames";
import { Card } from "../../components";
import { Game } from "../../services/types";
import useWebSocket from 'react-use-websocket';
import { SnackbarComponent } from "../../components/SnackbarComponent";
import { UserObject } from "../../store/appContext/types";
import './Home.css';
import { useLocation } from "react-router-dom";
import Config from "../../config";

const Home = () => {
  const { user, tokens } = useAppContext();
  const [gamesData, setGamesData] = useState<Game[]>([]);
  const [socketUrl] = useState(`${Config.WS_URL}ws/updates/`);
  const location = useLocation();
  const { sendMessage, lastMessage, getWebSocket } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log('WebSocket Connected'),
      onClose: () => console.log('WebSocket Disconnected'),
      onError: (event) => console.log('WebSocket Error:', event),
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: (attemptNumber) => Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
    }
  );
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Close WebSocket connection when the location changes
  useEffect(() => {
    return () => {
      const websocket = getWebSocket();
      if (websocket) {
        websocket.close();
      }
    };
  }, [getWebSocket, location]);
  
  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      if (data.message === 'Plays updated') {
        const gameId = data['info'];
        setGamesData((gamesData) =>
          gamesData.map((game) =>
            game.id === gameId ? { ...game, needsUpdate: true } : game
          )
        );
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGamesData(user, tokens);
        if (data) {
          setGamesData(data);
        }
      } catch (error) {
        setAlertMessage('Hubo un error en el servidor, refresca la página');
        setOpen(true);
      }
    };

    fetchData();
  }, [user, tokens]);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const resetUpdateFlagForGame = (gameId: number) => {
    setGamesData((gamesData) =>
    gamesData.map((game) =>
        game.id === gameId ? { ...game, needsUpdate: false } : game
      )
    );
  };

  const sendUpdateMessage = useCallback((message: string, sender: UserObject | undefined, info: number) => {
    const data = message === "Plays updated" ? {
      type: "plays_updated",
      message,
      info,
      sender,
    } : {
      type: "update_message",
      message,
      sender,
    };
  
    sendMessage(JSON.stringify(data));
  }, [sendMessage]);

  return (
    <div className="cyber__wrapper">
      <div className="cyber__cards" id="cyberCards">
        
        {Array.isArray(gamesData)
          ? gamesData.map((game) => (
            <Card 
              key={game.id}
              cardGame={game}
              user={user}
              shouldUpdate={game.needsUpdate || false} 
              onUpdated={() => resetUpdateFlagForGame(game.id)}
              sendMessage={(cardGameId: number) => sendUpdateMessage("Plays updated", user, cardGameId)}
            />
          ))
          : "No hay juegos registrados."
        }

        {open && (

        <SnackbarComponent
          open={open}
          onClose={handleClose}
          severity="warning"
          message={alertMessage}
        />
        )}

      </div>
    </div>
  );
}

export default Home;
