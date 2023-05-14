import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Header from '../Header/Header';
import Main from '../Main/Main';
import EditProfilePopup from '../EditProfilePopup/EditProfilePopup';
import EditAvatarPopup from '../EditAvatarPopup/EditAvatarPopup';
import AddPlacePopup from '../AddPlacePopup/AddPlacePopup';
import ImagePopup from '../ImagePopup/ImagePopup';
import ConfirmationPopup from '../ConfirmationPopup/ConfirmationPopup';
import Footer from '../Footer/Footer';
import CurrentUserContext from '../../contexts/CurrentUserContext';

function App() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ name: '', link: '#' });
  const [deletedCardId, setDeletedCardId] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.getInitialCards()
      .then((cardsData) => {
        setCards(cardsData);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(function () {
    api.getUserProfile()
      .then((userData) => { setCurrentUser(userData); })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function handleCardTrashClick(cardId) {
    setDeletedCardId(cardId);
    setIsDeleteCardPopupOpen(true);
  };

  function handleAddPlace(dataCard) {
    setIsLoading(true);
    api.addCard(dataCard)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateAvatar(avatar) {
    setIsLoading(true);
    api.editUserAvatar(avatar)
      .then(userData => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateUser(user) {
    setIsLoading(true);
    api.editUserProfile(user)
      .then(userData => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleDeleteCard() {
    setIsLoading(true);
    api.deleteCard(deletedCardId)
      .then(() => {
        const updatedCards = cards.filter((item) => item._id !== deletedCardId);
        setCards(updatedCards);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  };

  function handleCardClick(name, link) {
    setSelectedCard({ name: name, link: link, });
    setIsImagePopupOpen(true);
  }

  function handleCardLike(card) {
    const hasUserLike = card.likes.some(item => item._id === currentUser._id);
    api.changeLikeCardStatus(card._id, hasUserLike)
      .then((newCard) => {
        setCards(cards.map((item) => item._id === card._id ? newCard : item,));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setIsImagePopupOpen(false);
    setTimeout(() => setIsLoading(false), 1000);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header />
      <Main cards={cards} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick}
        onCardClick={handleCardClick} onCardTrashClick={handleCardTrashClick} onCardLike={handleCardLike} />

      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} isLoading={isLoading} onUpdateAvatar={handleUpdateAvatar} />

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} isLoading={isLoading} onUpdateUser={handleUpdateUser} />

      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} isLoading={isLoading} onAddPlace={handleAddPlace} />

      <ConfirmationPopup isOpen={isDeleteCardPopupOpen} onClose={closeAllPopups} isLoading={isLoading} onConfirm={handleDeleteCard} />

      <ImagePopup isOpen={isImagePopupOpen} onClose={closeAllPopups} card={selectedCard} />

      <Footer />
    </CurrentUserContext.Provider>

  );
}

export default App;
