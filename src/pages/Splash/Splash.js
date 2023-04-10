import React from 'react';
import styles from './Splash.module.css';
import {useEffect , useState} from 'react'
import {useNavigate } from "react-router-dom";
import ld1 from './img/ldd.gif'

import d1  from './img/dish-1.png';
import d3  from './img/dish-3.png';
import d0  from './img/dish-0.png';
import d7 from './img/dish-7.png';
import d8 from './img/dish-8.png';





function Splash() {
    const dish_name = [d7,d8,d0,d1,d3];
    const [count, setCount] = useState(0);
    const [dish, setdish] = useState(0);
    const navigate = useNavigate();








    useEffect(() => {

        
        setTimeout(() => {
         
            if(dish <=5){
            setdish((dish) => dish+1);
            if(dish ==5){
                setdish((dish) => 1);
            }
            }
       
        }, 2000);


      setTimeout(() => {
        navigate('/login');
      }, 5000);
    }
    
    );





  
  return (
    <>
    <div className={styles.container}>
      
    <img src={dish_name[dish]} className={styles.gallery} />
    
    <div className={styles.loder_img_div}>
      <img src={ld1} className={styles.loder} />
        </div>
    </div>
    </>
  )
}

export default Splash
