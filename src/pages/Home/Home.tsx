import { useAppContext } from "../../store/appContext/useAppContext";
import { useState, useEffect, useCallback } from 'react';
import { getGamesData } from "./getGames";
import { Card } from "../../components";
import { Game } from "../../services/types";
import './Home.css';
import useWebSocket from 'react-use-websocket';
import { SnackbarComponent } from "../../components/SnackbarComponent";
import { UserObject } from "../../store/appContext/types";

const Home = () => {
  const { user, tokens } = useAppContext();
  const [gamesData, setGamesData] = useState<Game[]>([]);
  const [socketUrl] = useState('ws://172.174.255.29/ws/updates/');
  const { sendMessage, lastMessage } = useWebSocket(socketUrl);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
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
