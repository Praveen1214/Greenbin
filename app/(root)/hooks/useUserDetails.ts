// hooks/useUserDetails.ts
import { useState, useEffect } from "react";
import { getPassengerDetails } from "../services/UserService";

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState({
    userName: "",
    email: "",
    contact: "",
    gender: ""
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const passengerDetails = await getPassengerDetails();
      if (passengerDetails) {
        setUserDetails({
          userName: `${passengerDetails.firstname} ${passengerDetails.lastname}`,
          email: passengerDetails.email,
          contact: passengerDetails.contact,
          gender: passengerDetails.gender
        });
      }
    };

    fetchUserDetails();
  }, []);

  return userDetails;
};
