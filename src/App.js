import './App.scss';
import { Sidebar } from './components/sidebar/Sidebar';
import { Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { UploadSection } from './components/upload section/UploadSection';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
	const [opened, { toggle }] = useDisclosure(false);
	const label = opened ? 'Close navigation' : 'Open navigation';

  	return (
		<div className="App">
			{/* menu and sidebar */}
			<header className="collapsible-sidebar">
				<Burger opened={opened} onClick={toggle} aria-label={label} color="white" size="md" className="burger-menu"/>
				{opened ? ( <Sidebar/> ) : null}
			</header>

			{/* page title */}
			<div className="title">
			<h1>YOMI<span className="ot-sm">SNAP</span><span className="version">v1.1</span></h1>
				<p>Your own JP text in image translator buddy!</p>
			</div>

			{/* upload section is the bulk of the application */}
			<div className="center upload">
				<div className="container">
				<UploadSection/>
				</div>
			</div>

			{/* toastifies save lives */}
			<ToastContainer
				position="bottom-center" autoClose={5000} hideProgressBar
				newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss 
				draggable pauseOnHover={false} theme="colored" icon={false}
				limit={1}/>
		</div>
  	);
}

export default App;
