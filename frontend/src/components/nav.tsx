import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../data/useAuth";
import { useNavigate } from "react-router-dom";

// using type script we define and tell type script what we are getting or returning like setISOpen is return nothing so we used void....
type NavProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => (void);
}


// used ts in prop defining... NavProps ..
export default function Nav({ isOpen, setIsOpen }: NavProps) {

  {/* yo chai useState + array dis-structuring ho*/ }
  const [isActive, setIsActive] = useState("dashboard");
  const { logout, user } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* same logic use garako xu open xa vana yo dakha nava arko dakha wala but not the good logic  */}

      {/* <button className={`text-2xl cursor-pointer absolute left-57 rounded-full  top-6 ${isOpen ? "" : "invisible"}`} onClick={() => setIsOpen((is) => !is)}>
        <img src="close.svg" alt="menu" />
      </button>

      <button className={`text-3xl absolute cursor-pointer left-8 top-6 ${isOpen ? "invisible" : ""}`} onClick={() => setIsOpen((is) => !is)}>
        <img src="menu.svg" alt="menu" />
      </button> */}

      {/* same logic use garako xu open xa vana yo dakha nava arko dakha wala  */}
      {/* yo chai maila header.tsx ma halako xu.. */}


      {/* yo chai overlay effect ho jaba nav kholxum tati bala background black hunxa ani close huda back to normal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Plz try to understand this logic like maila ya useState ra And operator use garako xu
      jasla chai useState use garara open xa vana yo dakha nava arko dakha vana logic use garako xu */}

      {isOpen && <Fragment>
        <aside className={`fixed top-0 z-20 left-0 w-64 bg-gray-800 border-r flex flex-col justify-between min-h-screen`}>

          {/* This btn is inside beacause it wont be in fixed postion if we put outside the nav.... */}

          <button
            onClick={() => setIsOpen(false)}
            className="fixed top-7 left-56 cursor-pointer z-30">
            <img src="close.svg" alt="close menu" className="h-5 w-5" />
          </button>


          <div>
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
              <div>
                <img src="../img4.jpeg" alt="books" className="rounded-lg h-11 w-12 shadow-xl/20" />
              </div>
              <div>
                <h1 className="font-bold text-lg font-nav2 text-gray-200">Uni_Library</h1>
                <p className="text-sm text-gray-300 font-nav font-semibold">Management System</p>
              </div>
            </div>

            {/* Menu */}
            <nav className="px-4 mt-3 space-y-2 font-nav2 text-white">
              <button onClick={() => setIsActive('E-Library')} className={` ${isActive === 'E-Library' ? "bg-blue-500" : ""} w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white`}>
                <img src="../dashboard2.svg" alt="dashboard" />
                e-Library
              </button>

              <NavLink to="/" className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white ${isActive ? "bg-blue-500" : "hover:bg-black"}`}>
                <img src="../img1.svg" alt="dashboard" />
                Dashboard
              </NavLink>

              <NavLink to="/books" className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white ${isActive ? "bg-blue-500" : "hover:bg-black"}`}>
                <img src="../book.svg" alt="Book" />
                Books
              </NavLink>

              {(user?.role === 'admin' || user?.role === 'librarian') && (
                <NavLink to="/members" className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white ${isActive ? "bg-blue-500" : "hover:bg-black"}`}>
                  <img src="../img3.svg" alt="Members" />
                  Members
                </NavLink>
              )}

              <NavLink to="/issue-return" className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white ${isActive ? "bg-blue-500" : "hover:bg-black"}`}>
                <img src="img6.svg" alt="return" />
                Issue / Return
              </NavLink>

              {(user?.role === 'admin' || user?.role === 'librarian') && (
                <>
                  <NavLink to="/reports" className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white ${isActive ? "bg-blue-500" : "hover:bg-black"}`}>
                    <img src="report.svg" className="h-8 w-8" alt="report" />
                    Reports
                  </NavLink>

                  <NavLink to="/Fine Manager" className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white ${isActive ? "bg-blue-500" : "hover:bg-black"}`}>
                    <img src="fine.svg" className="h-8 w-8" alt="fine" />
                    Fine Manager
                  </NavLink>

                  <NavLink to="/settings" className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white ${isActive ? "bg-blue-500" : "hover:bg-black"}`}>
                    <img src="img4.svg" className="h-8 w-8" alt="settings" />
                    Settings
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* User Card */}
          <div className="flex items-center justify-center gap-3 mb-10 ">
            <button
                onClick={handleLogout}
                className="w-20 cursor-pointer duration-[1.5s] rounded-xl bg-purple-500 text-white px-4 py-2 hover:bg-red-600"
              >
                Logout
              </button>
          </div>
        </aside>
      </Fragment>

        // This is the outside icons....

        // (<Fragment>
        //   <aside className={`absolute top-22 left-0 flex flex-col justify-between min-h-screen`}>
        //     <div>
        //       {/* Menu */}
        //       <nav className="px-4 mt-3 space-y-2 font-nav text-white">

        //         <button onClick={() => setIsActive('dashboard')} className={` ${isActive === 'dashboard' ? "bg-gray-200" : "hover:bg-gray-200"} flex items-center gap-3 px-4 py-3 rounded-xl text-white`}>
        //           <img src="../dash.svg" alt="dashboard" />
        //         </button>

        //         <button onClick={() => setIsActive('books')} className={` flex items-center gap-3 px-4 py-3 rounded-xl  ${isActive === 'books' ? "bg-gray-200" : "hover:bg-gray-200"}`}>
        //           <img src="../books.svg" alt="Book" />
        //         </button>

        //         <button onClick={() => setIsActive('members')} className={`${isActive === "members" ? 'bg-gray-200' : 'hover:bg-gray-200'} flex items-center gap-3 px-4 py-3 rounded-xl`}>
        //           <img src="../group.svg" alt="Members" />
        //         </button>

        //         <button onClick={() => setIsActive('issue/Return')} className={`${isActive === "issue/Return" ? 'bg-gray-200' : 'hover:bg-gray-200'} flex items-center gap-3 px-4 py-3 rounded-xl`}>
        //           <img src="return3.svg" alt="return" />
        //         </button>

        //         <button onClick={() => setIsActive('reports')} className={`${isActive === "reports" ? 'bg-gray-200' : 'hover:bg-gray-200'} flex items-center gap-3 px-3 py-3 rounded-xl`}>
        //           <img src="report2.svg" className="h-8 w-8" alt="report" />
        //         </button>

        //         <button onClick={() => setIsActive('fine manager')} className={`${isActive === "fine manager" ? 'bg-gray-200' : 'hover:bg-gray-200'}  flex items-center gap-3 px-3 py-3 rounded-xl`}>
        //           <img src="paid.svg" alt="fine" className="h-7 w-7" />
        //         </button>

        //         <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-200">
        //           <img src="../setting.svg" alt="settings" />
        //         </button>
        //       </nav>
        //     </div>
        //   </aside>
        // </Fragment>)
      }
    </>
  );
}


