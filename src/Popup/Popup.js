function Popup({ showPopup, popupTimeName }) {
  return showPopup ? (
    <div className="popup-box">
      You are within 30 minutes of {popupTimeName}.
    </div>
  ) : null;
}
export default Popup;