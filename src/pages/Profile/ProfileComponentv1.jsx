import {
    Avatar,
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
    TextField, CardActions,
    IconButton,
    Stack,

} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import TabComponent from "./TabComponent";
import './Profile.css'
import { useState, useEffect } from "react";
import { getUserProfile } from "../../api/profile";
import ProfileSkeleton from "../../skeletons/ProfileSkeleton";
import { NavLink } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ProfileDrawer from "../../components/common/ProfileDrawer";
import AvatarUpload from "./AvatarUpload";
import CreateIcon from '@mui/icons-material/Create';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CircularProgress } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { useNotification } from "../../context/NotificationContext";
import { updateUserProfile } from "../../api/profile";

export default function ProfileComponent({ profile, username, setProfile }) {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false)
    const [sublength, setSublength] = useState(true)
    const [file, setFile] = useState(null)
    const [isEditting, setIsEditting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const { setMessage } = useNotification()



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
    const switchSubstringLength = () => {
        setSublength(prev => !prev)
    }

    const [formData, setFormData] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        image: "",
        description: "",
        shippingAddress: ""
    });


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
            console.log('gets here')
            console.log('this is form object', formData)
            setProfile(response.data)
            setFile(null);
            setIsEditting(false);
            setMessage({
                text: "Profile updated successfully",
                severity: "success"
            });
            navigate(`/profile/${currentUser.username}`)
        } catch (err) {
            setMessage({ text: err.response?.data?.message, severity: "error" })
        } finally {
            setIsSaving(false)
        }
    };
    const isOwnerProfile = profile?._id === currentUser?._id


    if (!profile || loading) return <ProfileSkeleton />

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }


    const handleSwitch = () => {
        setIsEditting(prev => !prev)
    }

    return (
        <ProfileDrawer profile={profile}>
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 960,
                    mx: "auto",
                    p: { xs: 2.5, sm: 4 },
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                }}
            >
                {/* ── Avatar + Name Section ── */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "center",
                        gap: 3,
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                        <AvatarUpload setFile={setFile} currentImage={profile?.image} />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" fontWeight={600}>
                            {profile?.firstname} {profile?.lastname}
                        </Typography>
                        <Typography sx={{ fontSize: "1.1rem", color: "text.secondary", my: 0.5 }}>
                            @{profile?.username}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {sublength
                                ? profile?.description?.substring(0, 100) || "No bio added yet"
                                : profile?.description}
                            {profile?.description?.length > 100 && (
                                <Button
                                    size="small"
                                    startIcon={sublength ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                                    onClick={switchSubstringLength}
                                >
                                    {sublength ? "Show More" : "Show Less"}
                                </Button>
                            )}
                        </Typography>
                    </Box>

                    {isOwnerProfile && (
                        <Button
                            color="inherit"
                            onClick={handleSwitch}
                            variant={isEditting ? 'contained' : 'outlined'}
                            startIcon={
                                isEditting ? <ArrowBackIcon /> : <CreateIcon />
                            }
                        >
                            {isEditting ? 'Back to Home' : 'Edit'}
                        </Button>
                    )}
                </Box>

                <Divider />

                {isEditting ? (


                    <Stack spacing={2}
                        component='form'
                        onSubmit={handleSubmit}>
                        <Typography sx={{ fontSize: '2rem' }}>Update Personal Information</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            label="Username"
                            name="username"
                            value={formData.username}
                            disabled
                            helperText="Username cannot be modified"
                        />

                        <TextField
                            fullWidth
                            size="small"
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            id="outlined-multiline-flexible"
                            label="Description"
                            name="description"
                            multiline
                            fullWidth
                            maxRows={4}
                            value={formData.description}
                            onChange={handleChange}
                        />
                        <Box sx={{ display: "flex", gap: 1.5 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="First Name"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                fullWidth
                                size="small"
                                label="Last Name"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                            />
                        </Box>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Shipping"
                            name="shippingAddress"
                            multiline
                            fullWidth
                            maxRows={4}
                            value={formData.shippingAddress}
                            onChange={handleChange}
                        />



                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSaving}
                            startIcon={
                                isSaving ? (
                                    <CircularProgress size={18} color="inherit" thickness={4} />
                                ) : (
                                    <SaveIcon />
                                )
                            }
                            sx={{ minWidth: 140 }}
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>

                    </Stack>

                ) : (
                    <>
                        <Typography sx={{ fontSize: '2rem' }}>Personal Information</Typography>

                        {/* <Stack spacing={2}> */}

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 3, // Adjust spacing as needed (e.g., 3 = 24px, or use '40px')
                            }}
                        >
                            <Box>
                                <Typography sx={{ fontWeight: '700', color: 'text.secondary' }}>
                                    Username
                                </Typography>
                                <Typography>@{profile.username}</Typography>
                            </Box>

                            <Box>
                                <Typography sx={{ fontWeight: '700', color: 'text.secondary' }}>
                                    Email
                                </Typography>
                                <Typography>{profile.email}</Typography>
                            </Box>

                            <Box>
                                <Typography sx={{ fontWeight: '700', color: 'text.secondary' }}>
                                    Firstname
                                </Typography>
                                <Typography>{profile.firstname}</Typography>
                            </Box>

                            <Box>
                                <Typography sx={{ fontWeight: '700', color: 'text.secondary' }}>
                                    Lastname
                                </Typography>
                                <Typography>{profile.lastname}</Typography>
                            </Box>

                            <Box sx={{ gridColumn: 'span 2' }}>
                                <Typography sx={{ fontWeight: '700', color: 'text.secondary' }}>
                                    Description
                                </Typography>
                                <Typography>{profile.description}</Typography>
                            </Box>
                        </Box>

                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: "2rem" }}>
                                    Address
                                </Typography>

                                <Typography variant="body2" sx={{ fontSize: '1.6rem' }}>
                                    {profile.shippingAddress}
                                </Typography>

                            </CardContent>

                        </Card>

                    </>
                )
                }


                {profile?.updatedAt && (
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                        Last modified: {new Date(profile.updatedAt).toLocaleDateString()}
                    </Typography>
                )}
            </Box >
        </ProfileDrawer >
    );
}