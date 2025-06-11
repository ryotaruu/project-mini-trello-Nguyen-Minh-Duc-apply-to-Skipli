import { Link } from "react-router-dom"

export const LogoProject = () => {
    return <>
        <Link to="/">
            <div className="text-center shadow">
                <h3 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Mini Trello
                </h3>

                <sup className="text-sm font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent italic">
                    Nguyễn Minh Đức - Apply Skipli
                </sup>
            </div>
        </Link>
    </>
}