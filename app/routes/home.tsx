import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import {ArrowRight, ArrowUpRight, Clock, Layers} from "lucide-react";
import Button from "../../components/ui/Button";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
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
                <div className="flex grid-overlay items-center justify-center">
                    <div className="upload-card ">
                        <div className="upload-head">
                            <div className="upload-icon">
                                <Layers className="icon" />
                            </div>
                            <h3>Upload your floor plan</h3>
                            <p>Supports JPG, PNG, formats upto 10MB</p>
                        </div>
                        <p className="text-black">Upload Images</p>
                    </div>
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
                      <div className="project-card group">
                          <div className="preview">
                              <img
                                  src="https://roomify-mlhuk267-dfwu1i.puter.site/projects/1770803585402/rendered.png"
                                  alt="Project Preview" />
                                  <div className="badge">
                                    <span>Community</span>
                                  </div>
                              </div>
                              <div className="card-body">
                                  <div>
                                      <h3>Project Luxury</h3>
                                      {/*Meta-data of the project*/}
                                      <div className="meta">
                                          <Clock size={12} />
                                          <span>{new Date('01.01.2027')
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
                  </div>
              </div>
          </section>
      </div>
  )
}
