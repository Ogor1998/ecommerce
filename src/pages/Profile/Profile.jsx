import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
// import ProfileComponent from "./ProfileComponent"
import ProfileComponent from "./ProfileDetails"
import './Profile.css'
import { Box } from "@mui/material"
import { getUserProfile } from "../../api/profile"
import ProfileDrawer from "../../components/common/ProfileDrawer"
import ProfileSkeleton from "../../skeletons/ProfileSkeleton"
import { useNotification } from "../../context/NotificationContext"
import { useAuth } from "../../context/AuthContext"
import ProfileDetails from "./ProfileDetails"
import { useProfile } from "../../context/ProfileContext"


export default function Profile() {
    // const [profile, setProfile] = useState({});
    // const [isEditting, setIsEditting] = useState(false)
    // const [loading, setLoading] = useState(true)
    // const { username } = useParams();
    // const { setMessage } = useNotification();
    // const { currentUser } = useAuth()
    const { profile, loading } = useProfile();

    // useEffect(() => {
    //     // if (!username || username === "undefined") return;
    //     const fetchProfile = async () => {
    //         try {
    //             const res = await getUserProfile()
    //             console.log(res.data)
    //             setProfile(res.data)

    //         } catch (err) {
    //             setMessage({
    //                 text: err.response?.data?.message,
    //                 severity: 'error'
    //             })
    //         } finally {
    //             setLoading(false)
    //         }
    //     }
    //     fetchProfile();
    // }, [currentUser])

    if (loading) {
        return <ProfileSkeleton />
    }
    return (

        <ProfileDetails profile={profile} />

    )
}