import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import {ArrowRight, ArrowUpRight, Clock, Layers} from "lucide-react";
import Button from "../../components/ui/Button";
import Upload from "../../components/Upload";
import {useNavigate} from "react-router";
import {MAX_FILE_SIZE_MB} from "../../lib/constants";
import {useState} from "react";
import {createProject} from "../../lib/puter.action";


/**
 * Provide route metadata for the page.
 *
 * @returns An array of route metadata objects: one setting the page title to "New React Router App" and one setting the description content to "Welcome to React Router!".
 */
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

/**
 * Handle completion of an image upload by creating a new project, persisting it, updating local state, and navigating to the visualizer for that project.
 *
 * @param base64Data - Base64-encoded image data to use as the project's source image
 * @returns `true` if the project was saved and navigation occurred, `false` otherwise
 */
export default function Home() {
    const navigate = useNavigate();

    const [projects, setProjects] = useState<DesignItem[]>([]);

    /*This function runs after an image upload finishes.
    It creates a new project, saves it, updates UI, and navigates to another page.*/
    const handleUploadComplete = async (base64Data: string) => {

        //Generate unique ID & name
        const newId = Date.now().toString();
        const name = `Residence ${newId}`;

        //Create a new project object
        const newItem = {
            id: newId, name,
            sourceImage : base64Data,
            renderedImage: undefined,
            timestamp: Date.now(),
        }

        //Save project
        const saved = await createProject({
            item: newItem, visibility: 'private'
        });

        if(!saved) {
            console.error('Failed to save project');
            return false;
        }

        //Update UI state. Adds a new project to the top of the list.
        setProjects((prev) => [ newItem,...prev]);
        navigate(`/visualizer/${newId}`,{
            state: {
                initialImage:saved.sourceImage,
                initialRender: saved.renderedImage || null,
                name
            }
        });

        return true;
    }
  return (
      <div className="home">
      <Navbar/>
        <section className="hero">
            <div className="announce">
                <div className="dot">
                    <div className="pulse"></div>
                </div>
                <p>Introducing ArchiGen</p>
            </div>
            <h1>Bring your dream spaces to life in seconds</h1>

            <p className="subtitle">
                ArchiGen is an AI-powered design platform that helps you create, visualize, and deliver architectural projects faster than ever
            </p>
            <div className="actions">
                <a href="#upload" className="cta">
                    Get Started <ArrowRight className="icon" />
                </a>

                <Button variant="outline" size="lg" className="demo">
                    Watch Demo
                </Button>
            </div>

            <div id="upload" className="upload-shell">
                <div className="grid-overlay" />
                <div className="upload-card">
                    <div className="upload-head">
                        <div className="upload-icon">
                            <Layers className="icon" />
                        </div>
                        <h3>Upload your floor plan</h3>
                        <p>Supports JPG, PNG, formats upto {MAX_FILE_SIZE_MB}MB</p>
                    </div>
                    <Upload onComplete={handleUploadComplete}/>
                </div>
            </div>
        </section>

          {/*Section which shows other projects that have been uploaded*/}
          <section className="projects">
              <div className="section-inner">
                  <div className="section-head">
                    <div className="copy">
                        <h2>Projects</h2>
                        <p>
                            Explore your latest creations alongside shared community projects
                        </p>
                    </div>
                  </div>
                  <div className="projects-grid">
                      {projects.map(({id, name, renderedImage, sourceImage, timestamp}) => (
                          <div className="project-card group">
                              <div className="preview">
                                <img
                                  src={renderedImage || sourceImage}
                                  alt="Project Preview" />
                                  <div className="badge">
                                    <span>Community</span>
                                  </div>
                              </div>
                              <div className="card-body">
                                  <div>
                                    <h3>{name}</h3>
                                    {/*Meta-data of the project*/}
                                  <div className="meta">
                                      <Clock size={12} />
                                      <span>{new Date(timestamp)
                                          .toLocaleDateString()}
                                      </span>
                                      <span>By Anushka</span>
                                  </div>
                                </div>
                                <div className="arrow">
                                    <ArrowUpRight size={18} />
                                </div>
                              </div>
                          </div>
                      ))}

                  </div>
              </div>
          </section>
      </div>
  )
}
