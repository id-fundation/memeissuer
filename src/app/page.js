'use client'; 
import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useState, useEffect } from "react";
import { BrowserProvider,isAddress } from "ethers";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Card from 'react-bootstrap/Card';
import '@regulaforensics/vp-frontend-face-components';
import { ST } from 'next/dist/shared/lib/utils';

const Home = (params)=> {
  const [step, setStep] = useState(1)
    const [address, setAddress] = useState("")
    const [did, setDid] = useState("")
    const [image, setImage] = useState("")
    const [hash,  setHash] = useState("")
    const scanAddress ="https://sepolia.etherscan.io/tx/"

  
  async function faceListener(event) {
    if (event.detail.action === 'PROCESS_FINISHED' && event.detail.data.status === 1) {
        const response = event.detail.data.response;
        setImage(response.images[0])
        const resp = await Confirm(did, response.images[0])
        if (resp.hash) {
          setHash(resp.hash)
          setStep(4)
        } else {
          alert("Something went wrong")
        }
      
        

    }
}



  useEffect(() => {
    const component = document.getElementsByTagName('face-liveness')[0];
    if (component) {
      //component.settings = regulaSettings;
      component.addEventListener('face-liveness', faceListener);
    }
  },[step])

    const handleChange = (data) => {
        setAddress(data.target.value)

    }

    const handleDetect = async() => {
      const res= await IsOwn(address)
      if (res.did) {
        setDid(res.did)
        setStep(2)
      } else {
        alert("Sorry but your address does not hava id token")
      }
    }
    const handleNext = () => {
       setStep(step+1) 
    };

    const stepOne = () => {
        return (
            <>
            <Card className="border-primary">
              <Card.Body>
              <Card.Title  className="text-primary">Enter your Wallet Address</Card.Title>
              <Stack gap={3}  style={{width:"400px", margin:"36px"}}>
              <Form.Control
                   aria-describedby="basic-addon1"
                   placeholder="Wallet address"
                   value={address}
                   onChange={handleChange}
                   type="text"
                   isValid= {isAddress(address)}
                   style={{ borderRadius: "12px" }} 
                  />              
                <Button style={{ borderRadius: "12px" }} variant="outline-primary" onClick={handleDetect} active={isAddress(address)}>Next</Button>
              </Stack>
              
              </Card.Body>

            </Card>
             
            </>
        )
    }

    const stepTwo = () => {
        return (
            <>
 <Card className="border-primary">
              <Card.Body>
              <Card.Title  className="text-primary">ID Token Found</Card.Title>
              <Stack gap={3}>
                <span>Your DID:</span>
                <span>{did}</span>
                <span>Only one step to verify that you own this adress</span>
                <Button variant='primary' onClick={handleNext}>Continue faceID</Button>
              </Stack>
              </Card.Body>

            </Card>
             
            </>
        )
    }
 

  

    const stepThree = () => {
      return (
          <>  
            <face-liveness></face-liveness>
          </>
      )
  }
  
  const stepFour = () => {
    return (
        <>  
          <Card className="border-primary">
              <Card.Body style={{width:"300px", margin:"32px"}}>
              <Card.Title  className="text-primary">Your account verified!</Card.Title>
              <Stack gap={3}>
                <Stack>
                <span>1 meme coin transfered </span>
                <span>to your wallet address. </span>
                </Stack>
                <Image  src="meme.png" width={160} height={160} alt="img" />
                <a href=''></a>
                </Stack>
              
              </Card.Body>
              </Card>

        </>
    )
}



const getstep = () => {
  if (step === 1) {
    return stepOne()
  } else if (step === 2) {
    return stepTwo()
  } else if (step === 3) {
    return stepThree()
  } else if (step === 4) {
    return stepFour()
  } 
}

const getProgress = () => {
  if (step == 1) {
    return 35
  } else if (step ==3) {
    return 70
  } else if (step===4) {
    return 100
  }

}
    return (
      <>
      <Stack>
       <div className="flex items-center justify-center text-center">

           <Image  src="logo.png" width={80} height={80} alt="img" />
           </div>
           <div className="w-100" style={{ height: "34px", backgroundColor: "#DBDBDB" }} />
           <ProgressBar>
              <ProgressBar  variant="primary" now={getProgress()} key={1} />
           </ProgressBar>
           <Container >
              <Row>
                <Col xs={2}>
                <div>Put wallet address </div>
                </Col>
                <Col>
                <div className="vr" />
                </Col>
              <Col xs={3}>
              <div >Continue FaceID </div>
              </Col>
              
              <Col xs={2}>
              <div>Get your coin</div>

              </Col>
              </Row>
              

            </Container>
    </Stack>
           <Container>
             <Row className=" d-flex justify-content-md-center mt-4" >
                <Col md="auto" className="text-center">
                
                <Stack gap={3}>
                  {getstep()}
                    
                </Stack>
                
                </Col>
                 
             </Row>
         
        </Container>
      </>
       
    )
}

 async function Process(data){
  const resp = await fetch("https://token.id.foundation:8085/mvp/mint",{
      method:"POST",
      body:JSON.stringify(data)
  })
  return await resp.json()
}
export default Home


 async function IsOwn(wallet){
  const resp = await fetch("https://token.id.foundation:8085/mvp/havedid",{
      method:"POST",
      body:JSON.stringify({wallet:wallet})
  })
  return await resp.json()
}


async function Confirm(did, face){
  const resp = await fetch("https://token.id.foundation:8085/mvp/confirm",{
      method:"POST",
      body:JSON.stringify({"did":did, "face":face})
  })
  return await resp.json()
}