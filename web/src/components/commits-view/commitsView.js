import React, { Component } from "react";
import Navbar from "../navbar/navbar";
import ProjectContainer from "../projectContainer";
import { BranchDropdown } from "../repo-features";
import { bindActionCreators } from "redux";
import * as commitActions from "../../actions/commitActions";
import "./commitsView.css";
import arrow_blue from "../../images/arrow_down_blue_01.svg";
import file_01 from "../../images/file_01.svg";
import folder_01 from "../../images/folder_01.svg";
import { connect } from "react-redux";

class CommitsView extends Component {
    state = {
        show: false,
        commits: []
    }

    componentDidMount() {
        const projectId = this.props.match.params.projectId;
        this.props.actions.getCommits(projectId)
            .then(res => res.json())
            .then(response => this.setState({ commits: response }));
    }

    handleBlur = e => {
        if (this.node.contains(e.target)) {
            return;
        }
        this.handleDrop();
    };

    handleDrop = e => {
        if (!this.state.show) {
            document.addEventListener("click", this.handleBlur, false);
        } else {
            document.removeEventListener("click", this.handleBlur, false);
        }
        this.setState(prevState => ({
            show: !prevState.show
        }));
    };

    render() {
        const projectId = this.props.match.params.projectId;
        const proj = this.props.projects.filter(proj => proj.id === parseInt(projectId))[0];
        const distinct = [...new Set(this.state.commits.map(x => new Date(x.committed_date).toLocaleString("en-eu", { day: "numeric", month: "short", year: "numeric" })))];
        return (
            <div id="commits-view-container">
                <Navbar />
                <ProjectContainer project={proj} activeFeature="data" folders={['Group Name', proj.name, 'Data', 'Commits']} />
                <br />
                <br />
                <div className="main-content">
                    <div className="commit-path">
                        <div className="btn">
                            <a href="#f00" onClick={this.handleDrop} ref={node => { this.node = node; }}>
                                <b>Master</b>
                                <img className="dropdown-white" src={arrow_blue} alt="" />
                            </a>
                        </div>
                        {this.state.show && <BranchDropdown />}
                        <input type="text" placeholder="Filter by commit message" />
                    </div>
                    {distinct.map((commit, index) => {
                        return (
                            <div className="commit-per-date">
                                <div className="commit-header">
                                    <p>Commits on {commit}</p>
                                </div>
                                {this.state.commits.map(item => {
                                    return (
                                        new Date(item.committed_date).toLocaleString("en-eu", { day: "numeric", month: "short", year: "numeric" }) === commit
                                            ? <Commits title={item.title} name={item.committer_name} id={item.short_id} time={item.committed_date} />
                                            : ""
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

function Commits(props) {
    var today = new Date();
    var previous = new Date(props.time);
    var diff = today - previous;
    let timediff;
    if (diff > 2678400e3) {
        timediff = Math.floor(diff / 2678400e3) + " months ago"
    }
    else if (diff > 604800e3) {
        timediff = Math.floor(diff / 604800e3) + " weeks ago"
    }
    else if (diff > 86400e3) {
        timediff = Math.floor(diff / 86400e3) + " days ago"
    }
    else if (diff > 3600e3) {
        timediff = Math.floor(diff / 3600e3) + " hours ago"
    }
    else if (diff > 60e3) {
        timediff = Math.floor(diff / 60e3) + " minutes ago"
    }
    else {
        timediff = Math.floor(diff / 1e3) + " seconds ago"
    }
    return (
        <div className="commits">
            <div className="commit-list">
                <div className="commit-pic-circle" />
                <div className="commit-data">
                    <p>{props.title}</p>
                    <span>
                        {props.name} authored {timediff}
                    </span>
                </div>
                <div className="commit-details">
                    <span>{props.id}</span>
                    <img className="file-icon" src={file_01} alt="" />
                    <img className="folder-icon" src={folder_01} alt="" />
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        projects: state.projects
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(commitActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommitsView);