import {
    Avatar,
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
    Paper,
    IconButton,
    CardActionArea, CardActions,
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

export default function ProfileComponent({ profile, username }) {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true)
    const [sublength, setSublength] = useState(true)
    const [file, setFile] = useState(profile?.image)
    useEffect(() => {
        if (!profile) return
        const fetchBoards = async () => {
            try {
                const res = await getUserProfile(profile.username)
                // setBoard(res.data.board)
                // setboardsCount(res.data.boardCount)
                // setCommentsCount(res.data.commentsCount)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchBoards()
    }, [profile])
    const switchSubstringLength = () => {
        setSublength(prev => !prev)
    }

    const isOwnerProfile = profile?._id === currentUser?._id
    console.log(profile.description)

    if (!profile || loading) return <ProfileSkeleton />

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
                            component={RouterLink}
                            to={`/profile/${username}/edit`}
                            variant="outlined"
                            color="inherit"
                        >
                            Edit
                        </Button>
                    )}
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Typography
                        sx={{
                            color: '#fff',
                            flexBasis: 'calc(50% - 8px)',
                            boxSizing: 'border-box',
                            p: 2,
                            bgcolor: 'primary.light',
                        }}
                    >
                        Firstname: {profile.firstname}
                    </Typography>
                    <Typography
                        sx={{
                            color: '#fff',
                            flexBasis: 'calc(50% - 8px)',
                            boxSizing: 'border-box',
                            p: 2,
                            bgcolor: 'primary.light',
                        }}
                    >
                        Lastname:  {profile.lastname}
                    </Typography>
                    <Typography
                        sx={{
                            color: '#fff',
                            flexBasis: 'calc(50% - 8px)',
                            boxSizing: 'border-box',
                            p: 2,
                            bgcolor: 'primary.light',
                        }}
                    >
                        Username: @{profile.username}
                    </Typography>
                    <Typography
                        sx={{
                            color: '#fff',
                            flexBasis: 'calc(50% - 8px)',
                            boxSizing: 'border-box',
                            p: 2,
                            bgcolor: 'primary.light',
                        }}
                    >
                        Email: {profile.email}
                    </Typography>
                </Box>


                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Default Shipping Address*
                        </Typography>
                        <Typography variant="body2">

                            {profile.shippingAddress}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>

            </Box>
        </ProfileDrawer>
    );
}