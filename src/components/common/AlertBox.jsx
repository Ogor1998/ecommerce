import * as React from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNotification } from '../../context/NotificationContext';
import { useLocation } from 'react-router-dom';
export default function AlertBox() {
    const { message, setMessage } = useNotification();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setMessage({ text: '', severity: '' });
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={Boolean(message?.text)}
            autoHideDuration={5000}
            onClose={handleClose}
            sx={{ mt: 7 }}
        >
            <Alert
                onClose={handleClose}
                severity={message?.severity || 'info'}
                variant="filled"
                sx={{ width: '100%', minWidth: 300, boxShadow: 3 }}
            >
                {message?.text}
            </Alert>
        </Snackbar>
    );
}

// import * as React from 'react';
// import { GooeyToaster, gooeyToast } from 'goey-toast';
// import 'goey-toast/styles.css';
// import { useNotification } from '../../context/NotificationContext';

// export default function AlertBox() {
//     const { message, setMessage } = useNotification();

//     React.useEffect(() => {
//         if (!message?.text) return;

//         const toastOptions = {
//             duration: 5000,
//         };

//         // Map MUI severities ('success', 'error', 'warning', 'info') to gooeyToast methods
//         switch (message.severity) {
//             case 'success':
//                 gooeyToast.success(message.text, toastOptions);
//                 break;
//             case 'error':
//                 gooeyToast.error(message.text, toastOptions);
//                 break;
//             case 'warning':
//                 gooeyToast.warning(message.text, toastOptions);
//                 break;
//             case 'info':
//             default:
//                 gooeyToast.info(message.text, toastOptions);
//                 break;
//         }

//         // Clear the context state immediately so the same message can be triggered again later
//         setMessage({ text: '', severity: '' });
//     }, [message, setMessage]);

//     return (
//         <GooeyToaster sound={false}
//             position="top-center"
//         />
//     );
// }
