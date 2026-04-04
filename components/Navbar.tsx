import React from "react";
import {Box} from "lucide-react";
import Button from "./ui/Button";
import {useOutletContext} from "react-router";
import ThemeToggle from "./ui/ThemeToggle";

const Navbar = () => {

    //👉 You are getting data + functions from the parent route using useOutletContext. So without passing props, I'm getting this data
    //AuthContext --> tells TypeScript: 👉 “The data I receive will match this structure”
    const { isSignedIn,userName,signIn,signOut} = useOutletContext<AuthContext>()

    const handleAuthClick = async () => {
        if(isSignedIn) {
            try {
                await signOut();
            }catch (e) {
                console.error(`Error signing out: ${e}`);
            }
            return;
        }

        try {
            await signIn();
        }catch (e) {
            console.error(`Error signing in: ${e}`);
        }
    };
    return (
    <header className="navbar">
        <nav className="inner">
            <div className="left">
                <div className="brand">
                    <Box className="logo"/>
                    <span className="name">ArchiGen</span>
                </div>
                <ul className="links">
                    <a href="#">Product</a>
                    <a href="#">Pricing</a>
                    <a href="#">Community</a>
                    <a href="#">Enterprise</a>
                </ul>
            </div>
            <div className="actions">
                <ThemeToggle />
                {isSignedIn ? (
                    <>
                        <span className="greeting">
                            {userName ? `Hello, ${userName}` : 'Signed In'}
                        </span>

                        <Button size="sm" onClick={handleAuthClick} className="btn">
                            Log Out
                        </Button>
                    </>
                ):(
                    <>
                        <Button size="sm" variant="ghost" onClick={handleAuthClick}>
                            Log In
                        </Button>

                        <a href="#upload" className="cta">
                            Get Started
                        </a>
                    </>
                )}


            </div>
        </nav>
    </header>
    )
};

export default Navbar;
