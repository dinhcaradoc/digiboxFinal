import { useState } from "react";

const UploadModal = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [recepientPhone, setRecepientPhone] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState([]);

  return (
    <div>
      The Upload Modal
    </div>
  )
}

export default UploadModal;