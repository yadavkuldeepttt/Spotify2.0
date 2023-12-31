import React, { useEffect } from "react";
import styled from "styled-components";
import { useStateProvider } from "../states/GlobalState";
import axios from "axios";
import { reducerCases } from "../states/Constants";

const CurrentTrack = () => {
  const [{ token, currentPlaying }, dispatch] = useStateProvider();
  useEffect(() => {
    const getCurrentTrack = async () => {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(response);
      if (response.data && response.data.item) {
        const currentPlaying = {
          id: response.data.item.id,
          name: response.data.item.name,
          artists: response.data.item.artists.map((artist) => artist.name),
          image: response.data.item.album.images[2].url,
        };
        dispatch({ type: reducerCases.SET_PLAYING }, currentPlaying);
      } else {
        dispatch({ type: reducerCases.SET_PLAYING }, null);
      }
    };

    getCurrentTrack();
  }, [token, dispatch]);

  return (
    <Container>
      {currentPlaying && (
        <div className="track">
          <div className="track_image">
            <img src={currentPlaying.image} alt="currentPlaying" />
          </div>
          <div className="track_info">
            <h5 className="track__info__track__name">{currentPlaying.name}</h5>
            <h6 className="track__info__track__artists">
              {currentPlaying.artists.join(",")}
            </h6>
          </div>
        </div>
      )}
    </Container>
  );
};

export default CurrentTrack;

const Container = styled.div`
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;
    &__image {
    }
    &__info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      &__track__name {
        color: white;
      }
      &__track__artists {
        color: #b3b3b3;
      }
    }
  }
`;
