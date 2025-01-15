import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    });

    const [isSearched, setIsSearched] = useState(false); // Changed setter to camelCase

    const [jobs , setJobs] = useState([]);

    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false);
    
    // Function to Fetch Jobs data
    const fetchJobs = async () => {
        setJobs(jobsData);
    }

    useEffect(() => {
        fetchJobs();
    }, []);
    
    const value = {
        searchFilter, setSearchFilter,
        setIsSearched, isSearched,
        jobs, setJobs,
        setShowRecruiterLogin, showRecruiterLogin
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}