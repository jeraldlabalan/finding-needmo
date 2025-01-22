import React, { useRef } from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ToastContainer } from "react-toastify";


const groupedHistory = {
  Today: [
    { Entry: "Search Query 1" },
    { Entry: "Search Query 2" },
  ],
  "January 18, 2025": [
    { Entry: "Old Search 1" },
    { Entry: "Old Search 2" },
  ],
};

const calendar_icon = "/path/to/calendar_icon.png";
const logo = "/path/to/logo.png";
const delete_search = "/path/to/delete_search.png";




const SearchHistoryComponent = ({
  groupedHistory,
  handleCalendarClick,
  handleDateChange,
  openClearSearchModal,
  openAllModal,
  handleDeleteSearch,
}) => {
  const calendarInputRef = useRef(null);

  return (
    <div className="container">
      

      <img src={logo} className="search_history_logo" alt="logo" />

      <div className="search_history_container">
        <div className="search_history_content_header">
          <div className="calendar_container">
            <img
              src={calendar_icon}
              className="calendar_icon"
              alt="Calendar Icon"
              onClick={handleCalendarClick}
            />
            <input
              type="date"
              id="calendar-input"
              className="calendar_input"
              ref={calendarInputRef}
              onChange={handleDateChange}
            />
          </div>

          <div className="search_history_action_buttons">
            <button onClick={openClearSearchModal}>Clear Search</button>
            <button onClick={openAllModal}>All</button>
          </div>
        </div>

        <div className="search_history_content">
          {Object.entries(groupedHistory).map(([dateGroup, entries]) => (
            <div className="search_history_item" key={dateGroup}>
              <h1>
                {dateGroup === "Today" || dateGroup === "Yesterday" ? (
                  dateGroup
                ) : (
                  <>
                    {dateGroup.split(",")[0]} <span>,</span>
                    <span>{dateGroup.split(",")[1]}</span>
                  </>
                )}
              </h1>
              <hr />
              <ul>
                {entries.map((entry, index) => (
                  <li key={index}>
                    <p>{entry.Entry}</p>
                    <button
                      onClick={() => handleDeleteSearch(entry)}
                      style={{ background: "transparent" }}
                    >
                      <img src={delete_search} alt="delete" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


describe("Search History Component", () => {
  const handleCalendarClick = jest.fn();
  const handleDateChange = jest.fn();
  const openClearSearchModal = jest.fn();
  const openAllModal = jest.fn();
  const handleDeleteSearch = jest.fn();

  test("renders the header, logo, and action buttons", () => {
    render(
      <SearchHistoryComponent
        groupedHistory={groupedHistory}
        handleCalendarClick={handleCalendarClick}
        handleDateChange={handleDateChange}
        openClearSearchModal={openClearSearchModal}
        openAllModal={openAllModal}
        handleDeleteSearch={handleDeleteSearch}
      />
    );

   


    expect(screen.getByAltText("logo")).toBeInTheDocument();


    expect(screen.getByText("Clear Search")).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  test("renders grouped history with correct date headings and entries", () => {
    render(
      <SearchHistoryComponent
        groupedHistory={groupedHistory}
        handleCalendarClick={handleCalendarClick}
        handleDateChange={handleDateChange}
        openClearSearchModal={openClearSearchModal}
        openAllModal={openAllModal}
        handleDeleteSearch={handleDeleteSearch}
      />
    );


    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("January 18")).toBeInTheDocument();


    const todayGroup = screen.getByText("Today").closest(".search_history_item");
    expect(within(todayGroup).getByText("Search Query 1")).toBeInTheDocument();
    expect(within(todayGroup).getByText("Search Query 2")).toBeInTheDocument();

    const oldGroup = screen.getByText("January 18").closest(".search_history_item");
    expect(within(oldGroup).getByText("Old Search 1")).toBeInTheDocument();
    expect(within(oldGroup).getByText("Old Search 2")).toBeInTheDocument();
  });

  test("handles calendar icon click", () => {
    render(
      <SearchHistoryComponent
        groupedHistory={groupedHistory}
        handleCalendarClick={handleCalendarClick}
        handleDateChange={handleDateChange}
        openClearSearchModal={openClearSearchModal}
        openAllModal={openAllModal}
        handleDeleteSearch={handleDeleteSearch}
      />
    );

   
    fireEvent.click(screen.getByAltText("Calendar Icon"));
    expect(handleCalendarClick).toHaveBeenCalled();
  });

  test("handles delete button clicks", () => {
    render(
      <SearchHistoryComponent
        groupedHistory={groupedHistory}
        handleCalendarClick={handleCalendarClick}
        handleDateChange={handleDateChange}
        openClearSearchModal={openClearSearchModal}
        openAllModal={openAllModal}
        handleDeleteSearch={handleDeleteSearch}
      />
    );

   
    const todayGroup = screen.getByText("Today").closest(".search_history_item");
    const deleteButton = within(todayGroup).getAllByAltText("delete")[0];

    fireEvent.click(deleteButton);
    expect(handleDeleteSearch).toHaveBeenCalledWith(groupedHistory.Today[0]);
  });
});



const ClearSearchModal = ({
  isClearSearchModalOpen,
  isClearSearchStepTwo,
  closeClearSearchModal,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleIconClick,
  handleClearSearchConfirm,
  formatDate,
}) => {
  return (
    <>
      {/* Clear Search Modal */}
      {isClearSearchModalOpen && (
        <div className="modal">
          <div className="modal_content">
            {!isClearSearchStepTwo ? (
              <>
                <img
                  className="delete_search"
                  onClick={closeClearSearchModal}
                  src="delete_search"
                  alt="delete icon"
                />

                <div className="modal_title">
                  <img className="trash_icon" src="trash_icon" alt="trash icon" />
                  <h2>choose custom date</h2>
                </div>

                <div className="modal_choose_date">
                  {/* Start Date */}
                  <div className="calendarContainer">
                    <span className="label">
                      {startDate ? formatDate(startDate) : "Start Date"}
                    </span>
                    <img
                      src="calendar_icon"
                      alt="Calendar Icon"
                      className="calendarIcon"
                      onClick={() => handleIconClick("startDateInputRef")}
                    />
                    <input
                      type="date"
                      className="dateInput"
                      onChange={(e) => setStartDate(e.target.value)}
                      aria-label="Start Date"
                    />
                  </div>

                  {/* End Date */}
                  <div className="calendarContainer">
                    <span className="label">
                      {endDate ? formatDate(endDate) : "End Date"}
                    </span>
                    <img
                      src="calendar_icon"
                      alt="Calendar Icon"
                      className="calendarIcon"
                      onClick={() => handleIconClick("endDateInputRef")}
                    />
                    <input
                      type="date"
                      className="dateInput"
                      onChange={(e) => setEndDate(e.target.value)}
                      aria-label="End Date"
                    />
                  </div>
                </div>

                <button className="confirm_delete_button" onClick={handleClearSearchConfirm}>
                  delete history
                </button>
              </>
            ) : (
              <>
                <img
                  className="delete_search"
                  onClick={closeClearSearchModal}
                  src="delete_search"
                  alt="delete icon"
                />
                <div className="modal_title">
                  <img className="trash_icon" src="trash_icon" alt="trash icon" />
                  <h2>choose custom date</h2>
                </div>
                <p>Selected searches deleted successfully.</p>
                <button onClick={closeClearSearchModal}>Done</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Tests
describe("Clear Search Modal Component", () => {
  const defaultProps = {
    isClearSearchModalOpen: true,
    isClearSearchStepTwo: false,
    closeClearSearchModal: jest.fn(),
    startDate: null,
    endDate: null,
    setStartDate: jest.fn(),
    setEndDate: jest.fn(),
    handleIconClick: jest.fn(),
    handleClearSearchConfirm: jest.fn(),
    formatDate: jest.fn((date) => date.toString()),
  };

  const renderComponent = (props = {}) =>
    render(<ClearSearchModal {...defaultProps} {...props} />);

  test("should render the modal when open", () => {
    renderComponent();
    expect(screen.getByAltText("delete icon")).toBeInTheDocument();
    expect(screen.getByText("choose custom date")).toBeInTheDocument();
  });

  test("should call closeClearSearchModal when delete icon is clicked", () => {
    renderComponent();
    const deleteIcon = screen.getByAltText("delete icon");
    fireEvent.click(deleteIcon);
    expect(defaultProps.closeClearSearchModal).toHaveBeenCalled();
  });

  test("should call setStartDate on start date input change", () => {
    renderComponent();
    const startDateInput = screen.getByLabelText("Start Date");
    fireEvent.change(startDateInput, { target: { value: "2025-01-01" } });
    expect(defaultProps.setStartDate).toHaveBeenCalledWith("2025-01-01");
  });

  test("should call setEndDate on end date input change", () => {
    renderComponent();
    const endDateInput = screen.getByLabelText("End Date");
    fireEvent.change(endDateInput, { target: { value: "2025-12-31" } });
    expect(defaultProps.setEndDate).toHaveBeenCalledWith("2025-12-31");
  });

  test("should render step two message when isClearSearchStepTwo is true", () => {
    renderComponent({ isClearSearchStepTwo: true });
    expect(screen.getByText("Selected searches deleted successfully.")).toBeInTheDocument();
  });

  test("should call closeClearSearchModal when Done button is clicked in step two", () => {
    renderComponent({ isClearSearchStepTwo: true });
    const doneButton = screen.getByText("Done");
    fireEvent.click(doneButton);
    expect(defaultProps.closeClearSearchModal).toHaveBeenCalled();
  });
});




const DeleteHistoryModal = ({
  isAllModalOpen,
  isAllStepTwo,
  closeAllModal,
  handleAllConfirm,
}) => {
  return (
    <>
      {isAllModalOpen && (
        <div className="modal">
          <div className="modal_content">
            {!isAllStepTwo ? (
              <>
                <img onClick={closeAllModal} src="delete_search" alt="delete icon" />
                <div className="modal_title">
                  <img className="trash_icon" src="trash_icon" alt="trash icon" />
                  <h2>Delete History</h2>
                </div>
                <p>Are you sure to delete all of your searches?</p>
                <button onClick={handleAllConfirm}>CONFIRM</button>
              </>
            ) : (
              <>
                <div className="modal_title">
                  <img className="trash_icon" src="trash_icon" alt="trash icon" />
                  <h2>Delete History</h2>
                </div>
                <p>All searches deleted successfully.</p>
                <button onClick={closeAllModal}>DONE</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Tests
describe("Delete History Modal Component", () => {
  const defaultProps = {
    isAllModalOpen: true,
    isAllStepTwo: false,
    closeAllModal: jest.fn(),
    handleAllConfirm: jest.fn(),
  };

  const renderComponent = (props = {}) =>
    render(<DeleteHistoryModal {...defaultProps} {...props} />);

  test("should render the modal when isAllModalOpen is true", () => {
    renderComponent();
    expect(screen.getByAltText("delete icon")).toBeInTheDocument();
    expect(screen.getByText("Delete History")).toBeInTheDocument();
    expect(screen.getByText("Are you sure to delete all of your searches?")).toBeInTheDocument();
    expect(screen.getByText("CONFIRM")).toBeInTheDocument();
  });

  test("should call closeAllModal when delete icon is clicked", () => {
    renderComponent();
    const deleteIcon = screen.getByAltText("delete icon");
    fireEvent.click(deleteIcon);
    expect(defaultProps.closeAllModal).toHaveBeenCalled();
  });

  test("should call handleAllConfirm when CONFIRM button is clicked", () => {
    renderComponent();
    const confirmButton = screen.getByText("CONFIRM");
    fireEvent.click(confirmButton);
    expect(defaultProps.handleAllConfirm).toHaveBeenCalled();
  });

  test("should render success message when isAllStepTwo is true", () => {
    renderComponent({ isAllStepTwo: true });
    expect(screen.getByText("All searches deleted successfully.")).toBeInTheDocument();
    expect(screen.getByText("DONE")).toBeInTheDocument();
  });

  test("should call closeAllModal when DONE button is clicked", () => {
    renderComponent({ isAllStepTwo: true });
    const doneButton = screen.getByText("DONE");
    fireEvent.click(doneButton);
    expect(defaultProps.closeAllModal).toHaveBeenCalled();
  });

  test("should not render the modal when isAllModalOpen is false", () => {
    renderComponent({ isAllModalOpen: false });
    expect(screen.queryByText("Delete History")).not.toBeInTheDocument();
  });
});



