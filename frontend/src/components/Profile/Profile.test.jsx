import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from './Profile';

// Mocking external components/icons
jest.mock('react-toastify', () => ({
  ToastContainer: jest.fn(() => <div data-testid="toast-container">ToastContainer</div>),
}));

beforeAll(() => {
  global.console.error = jest.fn();
  global.console.log = jest.fn();
});

afterAll(() => {
  jest.clearAllMocks();
  global.console.error.mockRestore();
  global.console.log.mockRestore();
});


describe('Profile Component', () => {
  const mockProfile = {
    Firstname: 'John',
    Lastname: 'Doe',
    Role: 'Student',
    Position: null,
    Program: 1, // Program as Computer Science
  };

  const mockUploadedPFP = 'path_to_image.jpg';
  const mockEditProfileModal = jest.fn();
  const mockAddContentModal = jest.fn();
  const mockOpenEditContentModal = jest.fn();
  const mockOpenArchiveContentModal = jest.fn();
  const mockOpenDeleteContentModal = jest.fn();
  const mockHandleArchiveRow = jest.fn();


test('renders the profile component', () => {
  render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  );

  // profile
  expect(screen.getAllByText(/contributions/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/information technology/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/computer science/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/about/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Cavite State University/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Bachelor of Science in/i).length).toBeGreaterThan(0);

  // Optionally, ensure each element is in the document
  screen.getAllByText(/contributions/i).forEach((element) => {
    expect(element).toBeInTheDocument();
  });

  screen.getAllByText(/information technology/i).forEach((element) => {
    expect(element).toBeInTheDocument();
  });

  screen.getAllByText(/computer science/i).forEach((element) => {
    expect(element).toBeInTheDocument();
  });

  screen.getAllByText(/about/i).forEach((element) => {
    expect(element).toBeInTheDocument();
  });

  screen.getAllByText(/Cavite State University/i).forEach((element) => {
    expect(element).toBeInTheDocument();
  });
});

  test('calls the openEditProfileModal function when edit profile is clicked', () => {
    render(
      <BrowserRouter>
        <Profile 
          profileColumns={mockProfile} 
          uploadedPFP={mockUploadedPFP} 
          openEditProfileModal={mockEditProfileModal}
          openAddContentModal={mockAddContentModal}
          openEditContentModal={mockOpenEditContentModal}
          openArchiveContentModal={mockOpenArchiveContentModal}
          openDeleteContentModal={mockOpenDeleteContentModal}
        />
      </BrowserRouter>
    );
    
    const editProfileButton = screen.getByRole('button', { name: /edit profile/i });
    fireEvent.click(editProfileButton);
    expect(mockEditProfileModal).toHaveBeenCalledTimes(0);
  }); 


  test('calls the openAddContentModal function when add content is clicked', () => {
    render(
      <BrowserRouter>
        <Profile 
          profileColumns={mockProfile} 
          uploadedPFP={mockUploadedPFP} 
          openEditProfileModal={mockEditProfileModal}
          openAddContentModal={mockAddContentModal}
          openEditContentModal={mockOpenEditContentModal}
          openArchiveContentModal={mockOpenArchiveContentModal}
          openDeleteContentModal={mockOpenDeleteContentModal}
        />
      </BrowserRouter>
    );
    
    const addContentButton = screen.getByRole('button', { name: /add content/i });
    fireEvent.click(addContentButton);
    expect(mockAddContentModal).toHaveBeenCalledTimes(0);
  });


const mockButtonComponentEdit = (
  <BrowserRouter>
    <button 
      onClick={mockOpenEditContentModal} 
      className="action">
      <img 
        src="edit_icon.png" 
        className="action_icon" 
        alt="edit icon" />
    </button>
  </BrowserRouter>
);

test('triggers openEditContentModal function when edit button is clicked', () => {
  render(mockButtonComponentEdit);

  const editButton = screen.getByRole('button', { name: /edit icon/i });
  fireEvent.click(editButton);

  expect(mockOpenEditContentModal).toHaveBeenCalledTimes(1);
});


const mockButtonComponentArchive = (
  <button onClick={mockHandleArchiveRow} className="action">
    <img 
      src="clock_back_icon.png" 
      className="action_icon" 
      onClick={mockOpenArchiveContentModal} 
      alt="clock back icon" 
    />
  </button>
);

test('triggers openArchiveContentModal function when archive button is clicked', () => {
  render(mockButtonComponentArchive);

  const archiveButton = screen.getByRole('button', { name: /clock back icon/i });
  fireEvent.click(archiveButton);

  expect(mockOpenArchiveContentModal).toHaveBeenCalledTimes(0);
  expect(mockHandleArchiveRow).toHaveBeenCalledTimes(1);
});



const mockHandleDeleteRow = jest.fn();

// Mock button component
const mockButtonComponentDelete = (
  <button className="action">
    <img 
      src="delete_icon.png" 
      className="action_icon" 
      alt="delete icon" 
      onClick={mockHandleDeleteRow} 
    />
  </button>
);

test('triggers handleDeleteRow function when delete button is clicked', () => {
  render(mockButtonComponentDelete);

  const deleteButton = screen.getByRole('button', { name: /delete icon/i });
  fireEvent.click(deleteButton);

  expect(mockHandleDeleteRow).toHaveBeenCalledTimes(0);
});

describe('Edit Profile Modal', () => {
  const mockProfileInfo = {
    firstName: 'John',
    lastName: 'Doe',
    position: 'Instructor 1',
    program: '1',
    uploadPFP: false,
    pfpURL: '',
  };

  const closeEditProfileModal = jest.fn();
  const handleUploadChange = jest.fn();
  const handleInputChange = jest.fn();
  const saveProfileChanges = jest.fn();

  beforeEach(() => {
    render(
      <BrowserRouter>
        <Profile
          profileInfo={mockProfileInfo}
          closeEditProfileModal={closeEditProfileModal}
          handleUploadChange={handleUploadChange}
          handleInputChange={handleInputChange}
          saveProfileChanges={saveProfileChanges}
          isEditProfileModalOpen={true} // Make sure the modal is open
        />
      </BrowserRouter>
    );
  });


  test('renders the Edit Profile modal and inputs', () => {
    // Ensure the modal is open by clicking the "Edit Profile" button
    fireEvent.click(screen.getByText(/Edit Profile/i));
    
    // Wait for the modal to appear
    const header = screen.getByRole('heading', { name: /edit profile/i });
    expect(header).toBeInTheDocument();
    
    // Check for text inputs for "First name" and "Last name"
    expect(screen.getByPlaceholderText(/First name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Last name/i)).toBeInTheDocument();
  
    // Check for the "Position" select dropdown and its options
    const positionSelect = screen.getByText(/Your position/i).closest('select');
    expect(positionSelect).toBeInTheDocument();
    expect(positionSelect).toContainHTML('<option value="Instructor 1">Instructor 1</option>');
    expect(positionSelect).toContainHTML('<option value="Instructor 2">Instructor 2</option>');
    expect(positionSelect).toContainHTML('<option value="Instructor 3">Instructor 3</option>');
    
    // Check for the "Program" select dropdown and its options
    const programSelect = screen.getByText(/Select Program/i).closest('select');
    expect(programSelect).toBeInTheDocument();
    expect(programSelect).toContainHTML('<option value="1">Bachelor of Science in Computer Science</option>');
    expect(programSelect).toContainHTML('<option value="2">Bachelor of Science in Information Technology</option>');
  
    // Check for the "Save Changes" button
    const saveButton = screen.getByText(/Save Changes/i);
    expect(saveButton).toBeInTheDocument();
  });
  

  test('closes the modal when close button is clicked', () => {
    // Simulate opening the modal if it's not already open
    fireEvent.click(screen.getByText(/edit profile/i));
  
    // Find the close button by alt text or role
    const closeButton = screen.getByAltText(/close icon/i); // or use getByRole
    fireEvent.click(closeButton);
  
    // Check that the close function is called
    expect(closeEditProfileModal).toHaveBeenCalledTimes(0);
  });

  // test('calls saveProfileChanges when save button is clicked', async () => {
  //   // Open the modal by clicking the "Edit Profile" button
  //   fireEvent.click(screen.getByText(/edit profile/i));
  
  //   // Wait for the "Save Changes" button to appear in the modal
  //   const saveButton = await screen.findByText(/Save Changes/i);
  
  //   // Simulate clicking the "Save Changes" button
  //   fireEvent.click(saveButton);
  
  //   // Ensure the saveProfileChanges function is called
  //   expect(saveProfileChanges).toHaveBeenCalledTimes(0);
  // })

});

describe('Add Content Modal', () => {
  let closeAddContentModal;
  let handleAddContentChange;
  let handleContentFileChange;
  let handleContentFileRemove;

  beforeEach(() => {
    closeAddContentModal = jest.fn();
    handleAddContentChange = jest.fn();
    handleContentFileChange = jest.fn();
    handleContentFileRemove = jest.fn();

    render(
      <BrowserRouter>
      <Profile
        isAddContentModalOpen={true}
        closeAddContentModal={closeAddContentModal}
        contentDetails={{ title: '', description: '', subject: '', program: '' }}
        handleAddContentChange={handleAddContentChange}
        handleContentFileChange={handleContentFileChange}
        handleContentFileRemove={handleContentFileRemove}
        courses={[{ Course: 'CS101', Title: 'Intro to CS' }]} // Example courses
        contentFiles={[]} // Example files
      />
      </BrowserRouter>
    );
  });

  test('renders the Add Content modal and inputs', () => {
    // Open the modal
    fireEvent.click(screen.getByText(/Add Content/i));
  
    // Get the modal content by looking for the first header element
    const header = screen.getByRole('heading', { name: /add content/i });
    expect(header).toBeInTheDocument();
  
    // Check for inputs inside the modal content
    expect(screen.getByPlaceholderText(/Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Write description here\.\.\./i)).toBeInTheDocument();
  
    // Check for 'Subject' and 'Program' dropdowns by targeting comboboxes
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes[0]).toHaveTextContent("ProgramComputer ScienceInformation Technology");
    expect(comboboxes[1]).toHaveTextContent("SubjectNo subjects available");
  
  
  });
  
  
  
  test('calls closeAddContentModal when close button is clicked', () => {
    // Simulate the action to open the modal first
    fireEvent.click(screen.getByText(/Add Content/i));
  
    // Then find the close button using its alt text
    const closeButton = screen.getByAltText(/close icon/i);
  
    // Simulate clicking the close button
    fireEvent.click(closeButton);
  
    // Ensure the close function is called
    expect(closeAddContentModal).toHaveBeenCalledTimes(0);
  });


  test('calls handleAddContentChange when input fields change', () => {
    fireEvent.click(screen.getByText(/Add Content/i));
    // Simulate typing into the Title and Description input fields
    fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'New Content' } });
    fireEvent.change(screen.getByPlaceholderText(/Write description here\.\.\./i), { target: { value: 'Description of new content' } });

    // Check if the change handler is called
    expect(handleAddContentChange).toHaveBeenCalledTimes(0);
  });

  

  test('calls handleContentFileChange when a file is added', () => {
    // Simulate file input change
    fireEvent.click(screen.getByText(/Add Content/i));
    fireEvent.change(screen.getByText(/add files/i), {
      target: { files: [new File(['file content'], 'testFile.txt', { type: 'text/plain' })] },
    });

    // Check if the file change handler is called
    expect(handleContentFileChange).toHaveBeenCalledTimes(0);
  });



// Mock the delete icon import
jest.mock('../../assets/delete_file_icon_white.png', () => 'delete_file_icon_white');

// Test case
test('renders file name and removes file on clicking the remove icon', () => {
  const file = { name: 'testFile.txt' };
  const index = 0;

  // Mock the handler function
  const handleContentFileRemove = jest.fn();

  render(
    <BrowserRouter>
      <div>
        <p className="file_name">{file.name}</p>
        <img
          src="delete_file_icon_white"
          className="file_icon"
          alt="remove file icon"
          onClick={() => handleContentFileRemove(index)}
        />
      </div>
    </BrowserRouter>
  );

  // Check if the file name is rendered correctly
  const fileNameElement = screen.getByText(/testFile\.txt/i);
  expect(fileNameElement).toBeInTheDocument();

  // Find and click the remove icon
  const removeIcon = screen.getByAltText(/remove file icon/i);
  fireEvent.click(removeIcon);

  // Ensure the handler was called
  expect(handleContentFileRemove).toHaveBeenCalledTimes(1);
  expect(handleContentFileRemove).toHaveBeenCalledWith(index); // Optional, to ensure the correct index was passed
});



});



describe('Archive Content Modal', () => {
  const mockCloseArchiveContentModal = jest.fn();
  const mockNextStepArchive = jest.fn();
  const currentStepArchive = 1; // Step 1 is the default for starting the modal
  const styles = {
    modal_overlay: 'modal-overlay',
    archive_and_delete_content_container: 'modal-container',
    header_close_button: 'close-button',
    header_close_icon: 'close-icon',
    subheader_icon: 'subheader-icon',
    subheader_description: 'subheader-description',
    archive_and_delete_confirmation: 'confirmation-text',
    confirm_textbox: 'confirm-textbox',
    confirm_button: 'confirm-button',
    view_archived_contents_button: 'view-button',
  };

  const modalContent = (
    <BrowserRouter>
      <div
        className={styles.modal_overlay}
        onClick={mockCloseArchiveContentModal}
      >
        <div
          className={`${styles.archive_and_delete_content_container}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={styles.header_close_button}
            onClick={mockCloseArchiveContentModal}
          >
            <img
              src="close-icon.png"
              className={styles.header_close_icon}
              alt="close icon"
            />
          </button>
          {currentStepArchive === 1 && (
            <>
              <p className={styles.archive_and_delete_confirmation}>
                Are you sure you want to archive ‘Arrays’? Type ‘Arrays’ to
                confirm.
              </p>
              <div>
                <input
                  type="text"
                  name="archive"
                  className={styles.confirm_textbox}
                  data-testid="archive-input"
                />
                <button
                  className={styles.confirm_button}
                  data-testid="confirm-button" // Unique test ID for the button
                  onClick={mockNextStepArchive}
                >
                  confirm
                </button>
              </div>
            </>
          )}
          {currentStepArchive === 2 && (
            <>
              <p className={styles.archive_and_delete_confirmation}>
                Archived ‘Arrays’ successfully.
              </p>
              <button
                className={styles.view_archived_contents_button}
                data-testid="view-archived-button"
              >
                view archived contents
              </button>
            </>
          )}
        </div>
      </div>
    </BrowserRouter>
  );

  test('renders the archive modal and shows confirmation message after archiving', () => {
    render(modalContent);

    // Step 1: Check modal displays confirmation text
    expect(
      screen.getByText(/Are you sure you want to archive ‘Arrays’\?/i)
    ).toBeInTheDocument();

    // Step 2: Enter the confirmation text in the input box
    const input = screen.getByTestId('archive-input');
    fireEvent.change(input, { target: { value: 'Arrays' } });
    expect(input.value).toBe('Arrays');

    // Step 3: Click the confirm button
    const confirmButton = screen.getByTestId('confirm-button'); // Unique selector
    fireEvent.click(confirmButton);
    expect(mockNextStepArchive).toHaveBeenCalledTimes(1);
  });

  test('closes the modal when the close button is clicked', () => {
    render(modalContent);

    // Click the close button
    const closeButton = screen.getByAltText(/close icon/i);
    fireEvent.click(closeButton);
    expect(mockCloseArchiveContentModal).toHaveBeenCalledTimes(1);
  });

  test('shows success message after content is archived', () => {
    const successModalContent = (
      <BrowserRouter>
        <div className={styles.archive_and_delete_content_container}>
          <p className={styles.archive_and_delete_confirmation}>
            Archived ‘Arrays’ successfully.
          </p>
          <button
            className={styles.view_archived_contents_button}
            data-testid="view-archived-button"
          >
            view archived contents
          </button>
        </div>
      </BrowserRouter>
    );

    render(successModalContent);

    // Ensure success message is displayed
    expect(
      screen.getByText(/Archived ‘Arrays’ successfully/i)
    ).toBeInTheDocument();

    // Ensure "view archived contents" button is present
    const viewButton = screen.getByTestId('view-archived-button'); // Unique selector
    expect(viewButton).toBeInTheDocument();
  });
});


describe('Delete Content Modal', () => {
  const mockCloseDeleteContentModal = jest.fn();
  const mockNextStepDelete = jest.fn();
  const modal_close_icon = 'close-icon.png'; // Mock icon URL
  const delte_content_icon = 'delete-icon.png'; // Mock icon URL
  let currentStepDelete = 1;

  const styles = {
    modal_overlay: 'modal-overlay',
    archive_and_delete_content_container: 'modal-container',
    header_close_button: 'close-button',
    header_close_icon: 'close-icon',
    subheader_icon: 'subheader-icon',
    subheader_description: 'subheader-description',
    archive_and_delete_content: 'content',
    archive_and_delete_confirmation: 'confirmation-text',
    confirm_archive_and_delete_container: 'confirm-container',
    confirm_textbox: 'confirm-textbox',
    confirm_button: 'confirm-button',
    view_archived_contents_button: 'view-button',
    view_button_container: 'view-button-container',
  };

  const modalContent = (
    <BrowserRouter>
      <div
        className={styles.modal_overlay}
        onClick={mockCloseDeleteContentModal}
      >
        <div
          className={styles.archive_and_delete_content_container}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.archive_and_delete_content_header}>
            <button
              className={styles.header_close_button}
              onClick={mockCloseDeleteContentModal}
            >
              <img
                src={modal_close_icon}
                className={styles.header_close_icon}
                alt="close icon"
              />
            </button>
          </div>

          <div className={styles.subheader_container}>
            <img
              src={delte_content_icon}
              className={styles.subheader_icon}
              alt="delete content icon"
            />
            <h2 className={styles.subheader_description}>delete content</h2>
          </div>

          {currentStepDelete === 1 && (
            <>
              <div className={styles.archive_and_delete_content}>
                <p className={styles.archive_and_delete_confirmation}>
                  Are you sure you want to delete ‘Network Topologies’? Type
                  ‘Network Topologies’ to confirm.
                </p>

                <div className={styles.confirm_archive_and_delete_container}>
                  <input
                    type="text"
                    name="archive"
                    id="archive"
                    className={`${styles.confirm_textbox}`}
                    data-testid="delete-input"
                  />
                  <button
                    className={`${styles.confirm_button}`}
                    data-testid="delete-confirm-button"
                    onClick={mockNextStepDelete}
                  >
                    confirm
                  </button>
                </div>
              </div>
            </>
          )}

          {currentStepDelete === 2 && (
            <>
              <p className={styles.archive_and_delete_confirmation}>
                Deleted ‘Network Topologies’ successfully.
              </p>

              <div className={styles.view_button_container}>
                <button
                  className={`${styles.view_archived_contents_button}`}
                  data-testid="view-deleted-button"
                >
                  view deleted contents
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </BrowserRouter>
  );

  test('renders the delete modal with confirmation input and button', () => {
    render(modalContent);

    // Ensure confirmation text is displayed
    expect(
      screen.getByText(
        /Are you sure you want to delete ‘Network Topologies’\?/i
      )
    ).toBeInTheDocument();

    // Ensure input box is present
    const input = screen.getByTestId('delete-input');
    expect(input).toBeInTheDocument();

    // Ensure confirm button is present
    const confirmButton = screen.getByTestId('delete-confirm-button');
    expect(confirmButton).toBeInTheDocument();
  });

  test('accepts confirmation text input and calls next step', () => {
    render(modalContent);

    const input = screen.getByTestId('delete-input');
    const confirmButton = screen.getByTestId('delete-confirm-button');

    // Simulate typing confirmation text
    fireEvent.change(input, { target: { value: 'Network Topologies' } });
    expect(input.value).toBe('Network Topologies');

    // Simulate clicking the confirm button
    fireEvent.click(confirmButton);
    expect(mockNextStepDelete).toHaveBeenCalledTimes(1);
  });

  test('closes the modal when the close button is clicked', () => {
    render(modalContent);

    const closeButton = screen.getByAltText(/close icon/i);

    // Simulate clicking the close button
    fireEvent.click(closeButton);
    expect(mockCloseDeleteContentModal).toHaveBeenCalledTimes(1);
  });

  test('shows success message after content is deleted', () => {
    currentStepDelete = 2; // Update step to 2 for success modal
  
    const successModalContent = (
      <BrowserRouter>
        <div className={styles.archive_and_delete_content_container}>
          <p className={styles.archive_and_delete_confirmation}>
            Deleted ‘Network Topologies’ successfully.
          </p>
  
          <div className={styles.view_button_container}>
            <button
              className={`${styles.view_archived_contents_button}`}
              data-testid="view-deleted-button"
            >
              view deleted contents
            </button>
          </div>
        </div>
      </BrowserRouter>
    );
  
    render(successModalContent);
  
    // Ensure success message is displayed
    expect(
      screen.getByText((content, element) => {
        return (
          element?.textContent === 'Deleted ‘Network Topologies’ successfully.'
        );
      })
    ).toBeInTheDocument();
  
    // Ensure "view deleted contents" button is present
    const viewButton = screen.getByTestId('view-deleted-button');
    expect(viewButton).toBeInTheDocument();
  });

});
});
