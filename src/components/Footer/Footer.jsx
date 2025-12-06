import React, { useState, useEffect } from "react";
import styles from "./Footer.module.css";
import logoIcon from "../../assets/icons/moneyGuardLogo.svg";

const students = [
  {
    name: "Furkan Yucel",
    github: "https://github.com/furkycl",
    linkedin: "https://www.linkedin.com/in/furkycl",
    title: "Team Lead",
  },
  {
    name: "Cemre Deniz Yildiz",
    github: "https://github.com/Cemrdeniz",
    linkedin: "https://www.linkedin.com/in/cemre-yildiz",
    title: "Scrum Master",
  },
  {
    name: "Burcu Budak",
    github: "https://github.com/cucuhead",
    linkedin: "https://www.linkedin.com/in/burcu-budak",
    title: "Full Stack Developer",
  },
  {
    name: "Begum Narmanli",
    github: "https://github.com/begumnarmanli",
    linkedin: "https://www.linkedin.com/in/begumnarmanli",
    title: "Full Stack Developer",
  },
  {
    name: "Berke Zopirli",
    github: "https://github.com/zopirli-berke",
    linkedin: "https://www.linkedin.com/in/berke-zopirli",
    title: "Full Stack Developer",
  },
];

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const nextStudent = () => {
    setCurrentStudentIndex((prevIndex) => (prevIndex + 1) % students.length);
  };
  const prevStudent = () => {
    setCurrentStudentIndex(
      (prevIndex) => (prevIndex - 1 + students.length) % students.length
    );
  };

  const currentStudent = students[currentStudentIndex];

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerWrapper}>
          <div className={styles.footerLogoContainer}>
            <img
              src={logoIcon}
              alt="Money Guard Logo"
              className={styles.footerLogoIcon}
            />

            <span className={styles.footerLogoText}>Money Guard</span>
          </div>

          <div className={styles.footerInfoContainer}>
            <span>(c) 2025 All rights reserved</span>
            <span className={styles.footerStudentLink} onClick={openModal}>
              GoIT Student
            </span>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <div className={styles.footerModalBackdrop} onClick={closeModal}>
          <div
            className={styles.footerModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.footerModalCloseButton}
              onClick={closeModal}
            >
              &times;
            </button>

            <h2 className={styles.footerModalHeader}>Our Team</h2>

            <div className={styles.modalStudentCard}>
              <h3 className={styles.modalStudentName}>{currentStudent.name}</h3>
              <p className={styles.modalStudentTitle}>
                {currentStudent.title}
              </p>
              <p className={styles.modalStudentCounter}>
                {currentStudentIndex + 1} / {students.length}
              </p>

              <div className={styles.modalLinksContainer}>
                <a
                  href={currentStudent.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalSocialLink}
                >
                  GitHub
                </a>
                <a
                  href={currentStudent.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalSocialLink}
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div className={styles.modalNavigation}>
              <button className={styles.modalNavButton} onClick={prevStudent}>
                &larr; Previous
              </button>
              <button className={styles.modalNavButton} onClick={nextStudent}>
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
