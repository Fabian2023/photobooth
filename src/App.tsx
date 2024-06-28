import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";
import "./App.css";
import uploadStringBase64 from "./firebase/firestorage";
import saveUserFirebase from "./firebase/firestore";
import axios from "axios";

function App() {
  const [screenACtive, setScreenActive] = useState(1);
  const [product, setProduct] = useState(0);
  const [hairstyle, setHairStyle] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [image, setImage] = useState<string | null>("");
  const [email, setEmail] = useState(""); //subir a firebase
  const [name, setName] = useState(""); // subir a firebase
  const [imageUrl, setImageUrl] = useState(""); // subir a firebase
  //const [isImageOnFirebase, setIsImageOnFirebase] = useState(false);
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [isChecked, setIsChecked] = useState(false);
  const [showGroupIndividual, setShowGroupIndividual] = useState(false);
  const [showIndividualImage, setShowIndividualImage] = useState(false);
  const [showGroupImage, setShowGroupImage] = useState(false);
  const [showBackground, setShowBackground] = useState(true);

  const hairstyles = {
    2000: [
      {
        key: "2000-hair-5", //grupo
        file: "img/group.png",
        file2: "img/Equipo pequeño.gif",
      },
      {
        key: "2000-hair-6", //grupo
        file: "img/logo2.png",
        file2: "img/EQUIPO 6 COMPLETO.gif",
      },
      {
        key: "2000-hair-7", // Conditt
        file: "img/logo3.png",
        file2: "img/JUGADOR AGACHADO.gif",
      },
      {
        key: "2000-hair-8", //Romero
        file: "img/logo4.png",
        file2: "img/JUGADOR BALON.gif",
      },
      {
        key: "2000-hair-9", //Toro
        file: "img/logo5.png",
        file2: "img/JUGADOR CAMISETA.gif",
      },
      {
        key: "2000-hair-10", //criss
        file: "img/logo6.png",
        file2: "img/JUGADOR CRUZADO BRAZOS.gif",
      },
      {
        key: "2000-hair-10", //gian
        file: "img/logo7.png",
        file2: "img/JUGADOR DEDO.gif",
      },
      {
        key: "2000-hair-10", //jose
        file: "img/logo8.png",
        file2: "img/JUGADOR DEDOS.gif",
      },
      {
        key: "2000-hair-10", //tremon
        file: "img/logo9.png",
        file2: "img/JUGADOR ESPALDA.gif",
      },
      {
        key: "2000-hair-10", //tremon
        file: "img/logo10.png",
        file2: "img/JUGADOR FIRME.gif",
      },
      {
        key: "2000-hair-10", //davon
        file: "img/logo11.png",
        file2: "img/JUGADOR TRENZAS AGACHADO.gif",
      },
      {
        key: "2000-hair-10", //steph
        file: "img/logo12.png",
        file2: "img/JUGADOR 11.gif",
      },
      {
        key: "2000-hair-10", //ford
        file: "img/logo13.png",
        file2: "img/JUGADOR DEDOS 2.gif",
      },
      {
        key: "2000-hair-10", //isaiah
        file: "img/logo14.png",
        file2: "img/JUGADOR TODO BIEN.gif",
      },
    ],
  };

  const [isCameraReady, setIsCameraReady] = useState(false);

  const handleUserMedia = () => {
    setIsCameraReady(true);
    console.log("La cámara está activa");
  };

  const handleUserMediaError = (error: string | DOMException) => {
    console.error("Error al acceder a la cámara:", error);
    if (error instanceof DOMException) {
      console.error("Nombre del error:", error.name);
      console.error("Mensaje de error:", error.message);
    }
    // Puedes agregar más manejo de errores según sea necesario
  };

  useEffect(() => {
    console.log(`isCameraReady changed: ${isCameraReady}`);
  }, [isCameraReady]);

  //const handleCheckboxChange = () => setIsChecked(!isChecked);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submittingss:", { email, name });
  };

  const exportAsImage = async () => {
    const element = document.querySelector("#miDiv");
    if (element instanceof HTMLElement) {
      // Verificar la visibilidad del fondo
      const fondo = document.querySelector(".background");
      if (fondo instanceof HTMLElement) {
        console.log("Fondo encontrado y visible:", fondo);
      } else {
        console.log("Fondo no encontrado o no visible");
      }

      const canvas = await html2canvas(element, {
        allowTaint: true,
        useCORS: true,
        logging: true,
        scale: 1,
      });

      const canvasImage = canvas.toDataURL("image/png", 1.0);
      const url = await uploadStringBase64(canvasImage);
      setImageUrl(url);
      //setIsImageOnFirebase(true);
    } else console.error("Element not found");
  };

  const sendEmail = async () => {
    await axios.post("https://devapi.evius.co/api/correos-mocion", {
      email: email,
      html: `<img src=${imageUrl} />`,
      subject: "Foto basket",
    });
    //setIsImageOnFirebase(false);
  };

  const saveUser = () => {
    saveUserFirebase(email, name);
  };

  const processPicture = () => {
    let imageSrc: string | undefined | null;
    if (webcamRef && "current" in webcamRef) {
      imageSrc = webcamRef.current?.getScreenshot();
    }
    setImage(imageSrc!);
    setShowBackground(true);
    console.log("estado del fondo", showBackground);

    setScreenActive(5);
  };

  const handleLogoClick = (file2: string) => {
    setHairStyle(file2);
    setScreenActive(3);
  };

  const renderScreen = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let html: any;
    switch (screenACtive) {
      case 2:
        html = (
          <div
            className={`screen screen-two ${screenACtive === 2 && "active"}`}
          >
            <div className="left">
              {hairstyles[product as keyof typeof hairstyles].map((data) => (
                <div
                  className={`menu menu-white${data.key}`}
                  onClick={() => handleLogoClick(data.file2)}
                  style={{ backgroundImage: `url(/${data.file})` }}
                  role="button"
                  aria-hidden="true"
                  key={data.key}
                />
              ))}
            </div>
            <img
              src="/img/continuar.png"
              className="btn-next"
              onClick={() => {
                hairstyle !== "" && setScreenActive(screenACtive + 1);
              }}
              role="button"
            />
            <div>{hairstyle !== "" && <img src={`/${hairstyle}`} />}</div>
          </div>
        );
        break;
      case 3:
        setTimeout(() => setCountdown(countdown - 1), 1000); // Reducido a 1000 para ajustar a 3 segundos
        html = (
          <div>
            {/* Mostrar el fondo siempre que showBackground sea true */}
            {showBackground && (
              <>
                {/* <img
            className="countdown"
            src={`/img/numero${countdown}.png`}
            alt="final countdown"
          /> */}
                <img
                  className="background"
                  src={`/img/fondo.png`}
                  alt="final countdown"
                />
              </>
            )}
          </div>
        );

        break;

      case 7:
        html = (
          <div
            style={{
              width: "1080px",
              height: "1920px",
              backgroundImage: "url('/img/email.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <form onSubmit={handleSubmit} className="form">
              <div>
                <input
                  className="form-input"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Correo electrónico"
                  required
                />
              </div>
              <div>
                <input
                  className="form-name"
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Nombre completo"
                  required
                />
              </div>
            </form>

            <div style={{ textAlign: "center", marginTop: "120px" }}>
              <button
                className="submit-button1"
                onClick={() => {
                  setHairStyle("");
                  setCountdown(3);
                  setIsCameraReady(false);
                  sendEmail();
                  saveUser();
                  setEmail("");
                  setName("");
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                }}
              >
                Enviar Foto
              </button>
              <button
                className="submit-button2"
                onClick={() => {
                  setScreenActive(3);
                  setCountdown(3);
                  setIsCameraReady(false);
                }}
              >
                Cambiar Foto
              </button>
            </div>
          </div>
        );
        console.log(name, email);
        break;
      default:
        html = (
          <div
            className={`screen screen-one ${screenACtive === 1 && "active"}`}
            onClick={() => setShowGroupIndividual(true)} // Mostrar el div con la imagen
          >
            {showGroupIndividual && !showIndividualImage && !showGroupImage && (
              <div>
                <img src="/img/grupal-individual.png" alt="GrupalIndividual" />

                <div
                  className="center-box"
                  style={{
                    position: "absolute",
                    top: "58%",
                    left: "55%",
                    transform: "translate(-50%, -50%)",
                    width: "300px",
                    height: "300px",
                    border: "none",
                    zIndex: 1,
                  }}
                  onClick={() => setShowIndividualImage(true)}
                />
                <div
                  className="group-box"
                  style={{
                    position: "absolute",
                    top: "78%",
                    left: "55%",
                    transform: "translate(-50%, -50%)",
                    width: "300px",
                    height: "300px",
                    border: "none",
                    zIndex: 1,
                  }}
                  onClick={() => setShowGroupImage(true)}
                />
              </div>
            )}
            {showIndividualImage && (
              <div>
                <img src="/img/individual.png" alt="Individual" />
                <div
                  className="Cris-Ortiz"
                  style={{
                    position: "absolute",
                    top: "43%",
                    left: "20%",
                    transform: "translate(-50%, -50%)",
                    width: "190px",
                    height: "220px",
                    border: "none",
                    zIndex: 1,
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/logo6.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />
                <div
                  className="Davon-Reed"
                  style={{
                    position: "absolute",
                    top: "43%",
                    left: "51%",
                    transform: "translate(-50%, -50%)",
                    width: "190px",
                    height: "220px",
                    border: "none",
                    zIndex: 1,
                    
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/logo11.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />
                <div
                  className="George-Conditt"
                  style={{
                    position: "absolute",
                    top: "43%",
                    left: "83%",
                    transform: "translate(-50%, -50%)",
                    width: "190px",
                    height: "220px",
                    border: "none",
                    zIndex: 1,
                    
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/logo3.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />
                <div
                  className="Gian-Clavell"
                  style={{
                    position: "absolute",
                    top: "58%",
                    left: "20%",
                    transform: "translate(-50%, -50%)",
                    width: "190px",
                    height: "220px",
                    border: "none",
                    zIndex: 1,
                    
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/logo7.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />
                <div
                  className="Jordan-Howard"
                  style={{
                    position: "absolute",
                    top: "58%",
                    left: "51%",
                    transform: "translate(-50%, -50%)",
                    width: "190px",
                    height: "220px",
                    border: "none",
                    zIndex: 1,
                    
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/logo10.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />
                <div
                  className="Ysmael-Romero"
                  style={{
                    position: "absolute",
                    top: "58%",
                    left: "83%",
                    transform: "translate(-50%, -50%)",
                    width: "190px",
                    height: "220px",
                    border: "none",
                    zIndex: 1,
                    
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/logo4.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />

                <div
                  className="Arnaldo-Toro"
                  style={{
                    position: "absolute",
                    top: "74%",
                    left: "20%",
                    transform: "translate(-50%, -50%)",
                    width: "190px",
                    height: "220px",
                    border: "none",
                    zIndex: 1,
                    
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/logo5.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />
                <div
                  className="Stephen-Thomson"
                  style={{
                    position: "absolute",
                    top: "74%",
                    left: "51%",
                    transform: "translate(-50%, -50%)",
                    width: "190px",
                    height: "220px",
                    border: "none",
                    zIndex: 1,
                    
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/logo12.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />
                <div
                  className="Tremont-Waters"
                  style={{
                    position: "absolute",
                    top: "74%",
                    left: "83%",
                    transform: "translate(-50%, -50%)",
                    width: "190px",
                    height: "220px",
                    border: "none",
                    zIndex: 1,
                    
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/logo9.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />
                <div
                  className="Aleem-ford"
                  style={{
                    position: "absolute",
                    top: "90%",
                    left: "20%",
                    transform: "translate(-50%, -50%)",
                    width: "190px",
                    height: "220px",
                    border: "none",
                    zIndex: 1,
                    
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/logo13.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />
                <div
                  className="Isaiah-Piñero"
                  style={{
                    position: "absolute",
                    top: "90%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "190px",
                    height: "220px",
                    border: "none",
                    zIndex: 1,
                    
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/logo14.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />
                <div
                  className="Jose-Alvarado"
                  style={{
                    position: "absolute",
                    top: "90%",
                    left: "83%",
                    transform: "translate(-50%, -50%)",
                    width: "190px",
                    height: "220px",
                    border: "none",
                    zIndex: 1,
                    
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/logo8.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />
              </div>
            )}
            {showGroupImage && (
              <div>
                <img src="/img/group.png" alt="group" />
                <div
                  className="group2-box"
                  style={{
                    position: "absolute",
                    top: "52%",
                    left: "55%",
                    transform: "translate(-50%, -50%)",
                    width: "450px",
                    height: "480px",
                    border: "none",
                    zIndex: 1,
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/logo2.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />
                <div
                  className="group3-box"
                  style={{
                    position: "absolute",
                    top: "82%",
                    left: "55%",
                    transform: "translate(-50%, -50%)",
                    width: "450px",
                    height: "480px",
                    border: "none",
                    zIndex: 1,
                  }}
                  onClick={() => {
                    const group2000 = hairstyles[2000].find(
                      (data) => data.file === "img/group.png"
                    );
                    if (group2000) {
                      handleLogoClick(group2000.file2);

                      setProduct(2000);
                    }
                  }}
                />
              </div>
            )}
          </div>
        );
        break;
    }
    return html;
  };

  useEffect(() => {
    if (screenACtive === 3) {
      setTimeout(() => processPicture(), 10000);
    }

    if (screenACtive === 5) {
      setTimeout(() => {
        setScreenActive(7), exportAsImage();
      }, 5000);
    }
  }, [screenACtive]);

  useEffect(() => {
    webcamRef;
  }, []);

  return (
    <div className="container">
      {/* Screens [ START ] */}
      {screenACtive !== 5 && renderScreen()}
      {screenACtive === 5 && (
        <div id="miDiv">
          <div
            style={{
              width: "1080px",
              height: "1920px",
              backgroundImage: `url('/img/fondo.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            id="f"
          >
            <div
              className="image"
              style={{
                backgroundImage: `url('${image}')`,
                position: "absolute",
              }}
            />
          </div>
        </div>
      )}

      {screenACtive === 3 && (
        <>
          {!isCameraReady && (
            <div
              style={{
                width: "1080px",
                height: "1920px",
                backgroundSize: "cover",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="/img/carga.gif"
                alt="Cargando..."
                style={{
                  width: "400px",
                  height: "400px",
                  position: "absolute",
                }}
              />
            </div>
          )}
          <Webcam
            ref={webcamRef}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
            mirrored={true}
            forceScreenshotSourceSize
            screenshotFormat="image/png"
            className="video-source"
            style={{
              display: `${isCameraReady ? "block" : "none"}`,
            }}
            videoConstraints={{
              width: 1920,
              height: 1080,
              frameRate: { ideal: 60, max: 60 },
            }}
          />
          <canvas
            ref={canvasRef}
            style={{ display: `${isCameraReady ? "block" : "none"}` }}
            className="appcanvas"
          />
          {isCameraReady && <img src={`/${hairstyle}`} alt="Jugadores" />}
        </>
      )}
      {/* Screens [ END ] */}
    </div>
  );
}

export default App;
