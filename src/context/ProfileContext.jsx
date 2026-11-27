import React, { useEffect } from 'react'
import { createContext, useContext, useState } from 'react'
import { getUserProfile } from '../api/profile';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileContext = createContext();


export function ProfileProvider({ children }) {
    const [loading, setIsLoading] = useState(false)
    const [profile, setProfile] = useState(null)
    const { setMessage } = useNotification()
    const { currentUser } = useAuth()
    const [file, setFile] = useState(null)
    const [isEditting, setIsEditting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate()



    useEffect(() => {
        if (!currentUser) {
            setProfile(null);
            setIsLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setIsLoading(true)
            try {
                const res = await getUserProfile()
                setProfile(res.data)

            } catch (err) {
                setMessage({
                    text: err?.response?.data?.message,
                    severity: 'error'
                })
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchProfile();
    }, [currentUser])




    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || "",
                firstname: profile.firstname || "",
                lastname: profile.lastname || "",
                email: profile.email || "",
                image: profile.image || "",
                description: profile.description || "",
                shippingAddress: profile.shippingAddress || ""
            });
        }
    }, [profile]);

    const [formData, setFormData] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        image: "",
        description: "",

    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true)

        const form = new FormData();
        form.append("username", formData.username)
        form.append("email", formData.email)
        form.append("firstname", formData.firstname)
        form.append("lastname", formData.lastname)
        form.append("description", formData.description)
        form.append("shippingAddress", formData.shippingAddress)

        if (file) {
            form.append("image", file)
        }

        console.log(formData)
        try {
            const response = await updateUserProfile(form);
            setProfile(response.data)
            setFile(null);
            setIsEditting(false);
            setMessage({
                text: "Profile updated successfully",
                severity: "success"
            });
            navigate(`/profile`)
        } catch (err) {
            setMessage({ text: err.response?.data?.message, severity: "error" })
        } finally {
            setIsSaving(false)
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }





    return (
        <ProfileContext.Provider value={
            {
                profile,
                setProfile,
                loading,
                handleChange,
                file,
                setFile,
                isEditting,
                setIsEditting,
                handleSubmit,
                isSaving,
                formData,

            }
        }>
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    const context = useContext(ProfileContext)
    if (!context) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
}