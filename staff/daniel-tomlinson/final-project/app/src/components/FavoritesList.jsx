// ================== Imports ================== //

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Loggito from "../utils/Loggito";

import Search from "./Search";

import {
  retrieveQuestionsPublic,
  searchQuestionsPublic,
  updateFavorites,
} from "../logic";

import withContext from "../utils/withContext";

// ================== Component ================== //

function FavoritesList({
  handleEditQuestion,
  onReturn,
  gameBeingPlayed,
  handleSelectQuestionForGame,
  context: { handleFeedback },
}) {
  // ================== Consts ================== //

  const logger = new Loggito("List");

  const questionText = {}; // dictionary

  const handleSearch = (query) => setQuery(query);

  // ================== Hook consts ================== //

  const location = useLocation();

  const [favorites, setFavorites] = useState([]);
  const [query, setQuery] = useState();

  // ================== useEffects ================== //

  useEffect(() => {
    loadQuestionsPublic();
  }, []);

  useEffect(() => {
    loadQuestionsPublic();
  }, [query]);

  useEffect(() => {
    logger.info("useEffect communitylist");

    if (favorites) {
      favorites.map((question) => textAreaAdjust(question.id));
      logger.info("question text area adjusted");
    }
  });

  // ================== function: adjusts textarea height ================== //

  const textAreaAdjust = (questionId) => {
    questionText[questionId].style.height = "inherit";
    questionText[questionId].style.height = `${
      25 + questionText[questionId].scrollHeight
    }px`;
  };

  // ================== Function: retrieves public questions and renders favorites lis ================== //

  const loadQuestionsPublic = () => {
    try {
      if (!query)
        return retrieveQuestionsPublic(
          sessionStorage.token,
          (error, questions) => {
            if (error) {
              handleFeedback({ message: error.message, level: "error" });

              logger.warn(error.message);

              return;
            }

            const favoritesTemp = questions.filter(
              (question) => question.isFav === true
            );

            setFavorites(favoritesTemp);

            logger.debug("setFavorites", favorites);
          }
        );
      else
        searchQuestionsPublic(
          sessionStorage.token,
          query,
          (error, questions) => {
            if (error) {
              handleFeedback({ message: error.message, level: "error" });

              logger.warn(error.message);

              return;
            }

            const favoritesTemp = questions.filter(
              (question) => question.isFav === true
            );

            setFavorites(favoritesTemp);

            logger.debug("setFavorites", favorites);
          }
        );
    } catch (error) {
      handleFeedback({ message: error.message, level: "error" });

      logger.warn(error.message);
    }
  };

  // ================== Functions ================== //

  const onEditQuestion = (questionId) => {
    handleEditQuestion(questionId, location);
  };

  const onSelectQuestionForGame = (questionId) => {
    handleSelectQuestionForGame(questionId);
  };

  const handleUpdateFavorites = (questionId, action, location) => {
    try {
      updateFavorites(sessionStorage.token, questionId, action, (error) => {
        if (error) {
          handleFeedback({ message: error.message, level: "error" });

          logger.warn(error.message);

          return;
        }

        loadQuestionsPublic();
      });
    } catch (error) {
      handleFeedback({ message: error.message, level: "error" });

      logger.warn(error.message);
    }
  };

  const handleFavoritesClick = (questionId, action, location) => {
    handleUpdateFavorites(questionId, action, location);
  };

  const onFavoritesClick = (questionId, questionIsFav) => {
    let action = null;
    if (questionIsFav === true) action = "remove";
    else if (questionIsFav === false) action = "add";
    handleFavoritesClick(questionId, action, location);

    loadQuestionsPublic();
  };

  // ================== jsx ================== //

  return (
    <div className="grouped-elements questions-list-panel">
      <span
        className="material-symbols-outlined button-icon"
        onClick={onReturn}
      >
        arrow_back_ios_new
      </span>

      <div className="grouped-elements questions-list-panel">
        <Search onQuery={handleSearch} />
        {gameBeingPlayed === false && (
          <ul className="list-panel list questions-list">
            {favorites &&
              favorites.map((question) => (
                <li className="list__item" key={question.id}>
                  <div className="question-options-grouped">
                    <button
                      className="material-symbols-outlined question-option-button"
                      onClick={() => onEditQuestion(question.id)}
                    >
                      edit
                    </button>
                    {question.isFav && (
                      <span
                        className="material-symbols-rounded question-option-button question-option-button-stars--true"
                        onClick={() =>
                          onFavoritesClick(question.id, question.isFav)
                        }
                      >
                        stars
                      </span>
                    )}
                    {!question.isFav && (
                      <span
                        className="material-symbols-rounded question-option-button question-option-button-stars--false"
                        onClick={() =>
                          onFavoritesClick(question.id, question.isFav)
                        }
                      >
                        stars
                      </span>
                    )}

                    <div className="grouped-elements flex-row">
                      <span className="material-symbols-rounded question-option-button">
                        thumb_up
                      </span>
                      <p className="question-option-button">2</p>
                    </div>
                    <div className="grouped-elements flex-row">
                      <span className="material-symbols-rounded question-option-button">
                        thumb_down
                      </span>
                      <p className="question-option-button">3</p>
                    </div>
                  </div>
                  <p
                    ref={(ref) => (questionText[question.id] = ref)}
                    className="list__item-text list__item-text-readonly"
                  >
                    {question.question}
                  </p>
                </li>
              ))}
          </ul>
        )}
        {gameBeingPlayed === true && (
          <ul className="list-panel list questions-list">
            {favorites &&
              favorites.map((question) => (
                <li className="list__item" key={question.id}>
                  <div className="question-options-grouped">
                    <div className="grouped-elements flex-row">
                      <span className="material-symbols-rounded question-option-button">
                        thumb_up
                      </span>
                      <p className="question-option-button">2</p>
                    </div>
                    {question.isFav && (
                      <span className="material-symbols-rounded question-option-button question-option-button-stars--true">
                        stars
                      </span>
                    )}
                    {!question.isFav && (
                      <span className="material-symbols-rounded question-option-button question-option-button-stars--false">
                        stars
                      </span>
                    )}
                    <button
                      type="button"
                      className="select-question-button"
                      onClick={() => onSelectQuestionForGame(question.id)}
                    >
                      Select
                    </button>
                    <div className="grouped-elements flex-row">
                      <span className="material-symbols-rounded question-option-button">
                        thumb_down
                      </span>
                      <p className="question-option-button">3</p>
                    </div>
                  </div>
                  <textarea
                    ref={(ref) => (questionText[question.id] = ref)}
                    className="list__item-text input-item"
                    defaultValue={question.question}
                  ></textarea>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default withContext(FavoritesList);
