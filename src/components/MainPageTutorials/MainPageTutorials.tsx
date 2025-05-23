import { Button, Card, Grid, Stack, Typography } from "@mui/material";
import { DriveStep } from "driver.js";
import { useAppContext } from "../../store/appContext/useAppContext";

interface Tutorial {
  title: string;
  description: React.ReactNode;
  steps: DriveStep[];
}

export const MainPageTutorials = () => {
  const { driverObj } = useAppContext();

  const tutorials: Tutorial[] = [
    {
      title: "Agregar un jugador",
      description: "Cómo introducir un jugador a cierto juego",
      steps: [
        {
          element: ".cyber__card",
          popover: {
            title: "Seleccionar ",
            description:
              "Aqui puedes seleccionar el juego al que hay que añadir",
            onNextClick: () => {
              const checkbox = document.querySelector(".cyber__card__inner");
              if (checkbox) {
                (checkbox as HTMLInputElement).click();
              }
              driverObj && driverObj.moveNext();
            },
          },
        },
        {
          element: "#student_id",
          popover: {
            title: "Ingresar Matricula",
            description: "Agrega la matrícula del usuario",
            onPrevClick: () => {
              const gameCard = document.querySelector(".cyber__card__inner");
              if (gameCard) (gameCard as HTMLInputElement).click();
              driverObj && driverObj.movePrevious();
            },
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const gameCard = document.querySelector(".cyber__card__inner");
              if (gameCard) (gameCard as HTMLInputElement).click();
            }
          }
        },
        {
          element: "#submit-new-player-button",
          popover: {
            title: "Agregar estudiante",
            description: "Presiona el botón para agregar un estudiante",
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const gameCard = document.querySelector(".cyber__card__inner");
              if (gameCard) (gameCard as HTMLInputElement).click();
            }
          }
        },
      ],
    },
    {
      title: "Cambiar de juego",
      description: "Cómo cambiar el juego actual de un alumno",
      steps: [
        {
          element: ".cyber__card",
          popover: {
            title: "Seleccionar",
            description: "Selecciona el juego actual del alumno",
            onNextClick: () => {
              const checkbox = document.querySelector(".cyber__card__inner");
              if (checkbox) {
                (checkbox as HTMLInputElement).click();
              }
              driverObj && driverObj.moveNext();
            },
          },
        },
        {
          element: ".container__dropzone",
          popover: {
            title: "Seleccionar alumno",
            description: "Elige el alumno al que desees cambiar de juego",
            onPrevClick: () => {
              const gameCard = document.querySelector(".cyber__card__inner");
              if (gameCard) (gameCard as HTMLInputElement).click();
              driverObj && driverObj.movePrevious();
            },
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const gameCard = document.querySelector(".cyber__card__inner");
              if (gameCard) (gameCard as HTMLInputElement).click();
            }
          }
        },
        {
          element: '[aria-label="Cambiar de juego"]',
          popover: {
            title: "Seleccionar cambio de juego",
            description:
              "Presiona el botón para cambiar el juego, y elige el juego al que lo vas a cambiar",
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const gameCard = document.querySelector(".cyber__card__inner");
              if (gameCard) (gameCard as HTMLInputElement).click();
            }
          }
        },
      ],
    },
    {
      title: "Terminar la partida de un jugador",
      description: "Antes de que su tiempo termine",
      steps: [
        {
          element: ".cyber__card",
          popover: {
            title: "Seleccionar juego Actual",
            description:
              "Elige el estudiante al que quieras eliminar del juego",
            onNextClick: () => {
              const checkbox = document.querySelector(".cyber__card__inner");
              if (checkbox) {
                (checkbox as HTMLInputElement).click();
              }
              driverObj && driverObj.moveNext();
            },
          },
        },
        {
          element: ".container__dropzone",
          popover: {
            title: "Seleccionar alumno",
            description: "Elige el alumno que terminó su partida",
            onPrevClick: () => {
              const gameCard = document.querySelector(".cyber__card__inner");
              if (gameCard) (gameCard as HTMLInputElement).click();
              driverObj && driverObj.movePrevious();
            },
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const gameCard = document.querySelector(".cyber__card__inner");
              if (gameCard) (gameCard as HTMLInputElement).click();
            }
          }
        },
        {
          element: '[aria-label = "Terminar juego para el jugador"]',
          popover: {
            title: "Terminar Juego",
            description: "Oprimir el botón para terminar su partida actual",
          },
          onDeselected: () => {
            if (!driverObj?.isActive()) {
              const gameCard = document.querySelector(".cyber__card__inner");
              if (gameCard) (gameCard as HTMLInputElement).click();
            }
          }
        },
      ],
    },
    {
      title: "Alguien ya no quiso jugar",
      description: "En los primeros diez minutos",
      steps: [
        {
          popover: {
            title: "Mandar mensaje",
            description:
              "En este caso, debes notificar a un encargado para que borren el registro",
          },
        },
      ],
    },
  ];

  return (
    <Grid container spacing={2} marginX={2} marginBottom={3}>
      {tutorials.map((tutorial, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <Card sx={{ padding: 2, height: "100%" }}>
            <Stack justifyContent="space-between" height="100%">
              <div>
                <Typography variant="h4">{tutorial.title}</Typography>
                <div style={{ margin: "0.5rem 0" }}>{tutorial.description}</div>
              </div>
              <Button
                variant="outlined"
                sx={{ marginLeft: "auto" }}
                onClick={() => {
                  driverObj?.setSteps(tutorial.steps);
                  driverObj?.drive();
                }}
              >
                Ver tutorial
              </Button>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
