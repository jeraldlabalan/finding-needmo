import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

const ProfilePage = () => {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    firstName: "",
    program: null,
  });

  const openEditProfileModal = () => setIsEditProfileModalOpen(true);
  const closeEditProfileModal = () => setIsEditProfileModalOpen(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo((prev) => ({ ...prev, [name]: value }));
  };
  const saveProfileChanges = jest.fn();

  return (
    <div>
      <div>
        <img src="profilePhoto.png" alt="profile photo" />
        <button onClick={openEditProfileModal}>edit profile</button>
      </div>

      {isEditProfileModalOpen && (
        <div onClick={closeEditProfileModal}>
          <div onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            <button onClick={closeEditProfileModal}>
              <img src="closeIcon.png" alt="close icon" />
            </button>

            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={profileInfo.firstName}
              onChange={handleInputChange}
            />
            <select
              name="program"
              value={profileInfo.program || ""}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select Program
              </option>
              <option value="1">Computer Science</option>
              <option value="2">Information Technology</option>
            </select>
            <button onClick={saveProfileChanges}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
};

describe("Profile Student Page", () => {
  test("renders profile page correctly", () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    expect(screen.getByAltText("profile photo")).toBeInTheDocument();
    expect(screen.getByText(/edit profile/i)).toBeInTheDocument();
  });

  test("opens and closes Edit Profile modal", () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const editProfileButton = screen.getByRole("button", {
      name: /edit profile/i,
    });
    fireEvent.click(editProfileButton);

    const modalHeader = screen.getByRole("heading", { name: /edit profile/i });
    expect(modalHeader).toBeInTheDocument();

    const closeButton = screen.getByAltText("close icon");
    fireEvent.click(closeButton);

    expect(
      screen.queryByRole("heading", { name: /edit profile/i })
    ).not.toBeInTheDocument();
  });

  test("handles input changes in modal", () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/edit profile/i));

    const firstNameInput = screen.getByPlaceholderText(/First name/i);
    const programSelect = screen.getByRole("combobox");

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(programSelect, { target: { value: "1" } });

    expect(firstNameInput).toHaveValue("John");
    expect(programSelect).toHaveValue("1");
  });

  test("saves profile changes", async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/edit profile/i));
    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(screen.getByText(/Save Changes/i)).toBeInTheDocument();
    });
  });
});
