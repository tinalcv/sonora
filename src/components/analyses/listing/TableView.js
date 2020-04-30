/**
 * @author sriram
 *
 * A tabular view of analyses
 *
 */
import React, { useState } from "react";
import {
    build,
    DECheckbox,
    EmptyTable,
    EnhancedTableHead,
    formatDate,
    formatMessage,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";
import {
    IconButton,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
    Typography,
} from "@material-ui/core";
import {
    Help as HelpIcon,
    HourglassEmptyRounded as HourGlass,
    Launch as LaunchIcon,
    PermMedia as OutputFolderIcon,
    UnfoldMore as UnfoldMoreIcon,
    Repeat as RelaunchIcon,
    Description as LogsIcon,
} from "@material-ui/icons";
import ids from "../ids";
import { injectIntl } from "react-intl";
import messages from "../messages";
import constants from "../../../constants";
import analysisStatus from "../../models/analysisStatus";
import TableLoading from "../../utils/TableLoading";
import WrappedErrorHandler from "../../utils/error/WrappedErrorHandler";

const useStyles = makeStyles((theme) => ({
    name: {
        paddingLeft: theme.spacing(1),
    },
    action: {
        color: theme.palette.info.main,
        margin: theme.spacing(0.5),
        "&:hover": {
            color: theme.palette.primary.main,
        },
    },
    actionHover: {
        margin: theme.spacing(0.5),
        color: theme.palette.primary.main,
    },
}));

function AnalysisName(props) {
    const classes = useStyles();
    const analysis = props.analysis;
    const name = analysis.name;
    const baseId = props.baseId;
    return (
        <Tooltip
            id={build(baseId, ids.ANALYSIS_NAME_CELL, ids.TOOLTIP)}
            aria-label={name}
            title={name}
        >
            <Typography
                id={build(baseId, ids.ANALYSIS_NAME_CELL)}
                className={classes.name}
                variant="body2"
            >
                {name}
            </Typography>
        </Tooltip>
    );
}

function AppName(props) {
    const analysis = props.analysis;
    const name = analysis.app_name;
    return <Typography variant="body2">{name}</Typography>;
}

function Status(props) {
    const { analysis, baseId } = props;
    return (
        <Typography variant="body2" id={build(baseId, ids.STATUS)}>
            {analysis.status}
        </Typography>
    );
}

function Actions(props) {
    const classes = useStyles();
    const { analysis } = props;
    const isBatch = analysis.batch;
    const interactiveUrls = analysis.interactive_urls;
    const handleInteractiveUrlClick = props.handleInteractiveUrlClick;
    const handleGoToOutputFolder = props.handleGoToOutputFolder;
    const handleBatchIconClick = props.handleBatchIconClick;
    const status = analysis.status;
    const intl = props.intl;
    const baseId = props.baseId;
    const mouseOverId = props.mouseOverId;
    const analysisUser = props.analysisUser;
    const username = props.username;
    const isInteractive =
        (status === analysisStatus.SUBMITTED ||
            status === analysisStatus.RUNNING) &&
        interactiveUrls &&
        interactiveUrls.length > 0;
    const allowTimeExtn =
        analysis.interactive_urls &&
        analysis.interactive_urls.length > 0 &&
        analysis.status === analysisStatus.RUNNING &&
        username === analysisUser;
    const isDisabled = analysis.app_disabled;
    const className =
        mouseOverId === analysis.id ? classes.actionHover : classes.action;
    return (
        <>
            <Tooltip
                aria-label={formatMessage(intl, "goOutputFolder")}
                title={getMessage("goOutputFolder")}
                id={build(baseId, ids.ICONS.OUTPUT, ids.TOOLTIP)}
            >
                <IconButton
                    size="small"
                    onClick={() => handleGoToOutputFolder(analysis)}
                    id={build(baseId, ids.ICONS.OUTPUT, ids.BUTTON)}
                    className={className}
                >
                    <OutputFolderIcon />
                </IconButton>
            </Tooltip>
            {!isDisabled && (
                <Tooltip
                    aria-label={formatMessage(intl, "relaunch")}
                    title={getMessage("relaunch")}
                    id={build(baseId, ids.ICONS.RELAUNCH, ids.TOOLTIP)}
                >
                    <IconButton
                        size="small"
                        id={build(baseId, ids.ICONS.RELAUNCH, ids.BUTTON)}
                        className={className}
                    >
                        <RelaunchIcon />
                    </IconButton>
                </Tooltip>
            )}
            {isBatch && (
                <Tooltip
                    aria-label={formatMessage(intl, "htDetails")}
                    title={getMessage("htDetails")}
                    id={build(baseId, ids.ICONS.BATCH, ids.TOOLTIP)}
                >
                    <IconButton
                        size="small"
                        onClick={() => handleBatchIconClick(analysis)}
                        id={build(baseId, ids.ICONS.BATCH, ids.BUTTON)}
                        className={className}
                    >
                        <UnfoldMoreIcon />
                    </IconButton>
                </Tooltip>
            )}
            {isInteractive && (
                <Tooltip
                    id={build(baseId, ids.ICONS.INTERACTIVE, ids.TOOLTIP)}
                    aria-label={formatMessage(intl, "goToVice")}
                    title={getMessage("goToVice")}
                >
                    <IconButton
                        onClick={() =>
                            handleInteractiveUrlClick(interactiveUrls[0])
                        }
                        size="small"
                        id={build(baseId, ids.ICONS.INTERACTIVE, ids.BUTTON)}
                        className={className}
                    >
                        <LaunchIcon />
                    </IconButton>
                </Tooltip>
            )}
            {allowTimeExtn && (
                <>
                    <Tooltip
                        aria-label={formatMessage(intl, "extendTime")}
                        title={getMessage("extendTime")}
                        id={build(baseId, ids.ICONS.TIME_LIMIT, ids.TOOLTIP)}
                    >
                        <IconButton
                            id={build(baseId, ids.ICONS.TIME_LIMIT)}
                            size="small"
                            className={className}
                        >
                            <HourGlass />
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        aria-label={formatMessage(intl, "viewLogs")}
                        title={getMessage("viewLogs")}
                        id={build(baseId, ids.ICONS.LOGS, ids.TOOLTIP)}
                    >
                        <IconButton
                            id={build(baseId, ids.ICONS.LOGS, ids.BUTTON)}
                            size="small"
                            className={className}
                        >
                            <LogsIcon />
                        </IconButton>
                    </Tooltip>
                </>
            )}
            <Tooltip
                id={build(baseId, ids.ICONS.HELP, ids.TOOLTIP)}
                aria-label={formatMessage(intl, "requestHelp")}
                title={getMessage("requestHelp")}
            >
                <IconButton size="small" className={className}>
                    <HelpIcon />
                </IconButton>
            </Tooltip>
        </>
    );
}

const columnData = (intl) => [
    {
        id: ids.NAME,
        name: formatMessage(intl, "name"),
        numeric: false,
        enableSorting: true,
        key: "name",
    },
    {
        id: "actions",
        name: "",
        numeric: false,
        enableSorting: false,
        key: "actions",
    },
    {
        id: ids.OWNER,
        name: formatMessage(intl, "owner"),
        numeric: false,
        enableSorting: false,
        key: "owner",
    },
    {
        id: ids.APP,
        name: formatMessage(intl, "app"),
        numeric: false,
        enableSorting: false,
        key: "app",
    },
    {
        id: ids.START_DATE,
        name: formatMessage(intl, "startDate"),
        numeric: false,
        enableSorting: true,
        key: "startdate",
    },
    {
        id: ids.END_DATE,
        name: formatMessage(intl, "endDate"),
        numeric: false,
        enableSorting: true,
        key: "enddate",
    },
    {
        id: ids.STATUS,
        name: formatMessage(intl, "status"),
        numeric: false,
        enableSorting: true,
        key: "status",
    },
];

function TableView(props) {
    const {
        loading,
        error,
        username,
        listing,
        parentId,
        baseId,
        order,
        orderBy,
        selected,
        handleRequestSort,
        handleSelectAllClick,
        handleClick,
        handleInteractiveUrlClick,
        handleGoToOutputFolder,
        handleBatchIconClick,
        intl,
    } = props;

    const analyses = listing?.analyses;
    const tableId = build(baseId, ids.LISTING_TABLE);
    const [mouseOverId, setMouseOverId] = useState("");

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }

    return (
        <TableContainer component={Paper} style={{ overflow: "auto" }}>
            <Table
                id={tableId}
                stickyHeader={true}
                size="small"
                aria-label={formatMessage(intl, "ariaTableListing")}
            >
                <EnhancedTableHead
                    baseId={baseId}
                    selectable={true}
                    numSelected={selected.length}
                    rowsInPage={listing?.analyses?.length || 0}
                    order={order}
                    orderBy={orderBy}
                    columnData={columnData(intl)}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                />
                {loading && (
                    <TableLoading
                        numColumns={columnData(intl).length + 2}
                        numRows={25}
                        baseId={tableId}
                    />
                )}
                {!loading && (
                    <TableBody>
                        {(!analyses || analyses.length === 0) && !error && (
                            <EmptyTable
                                message={getMessage("noAnalyses")}
                                numColumns={columnData(intl).length}
                            />
                        )}
                        {analyses &&
                            analyses.length > 0 &&
                            analyses.map((analysis, index) => {
                                const id = analysis.id;
                                const user =
                                    analysis.username &&
                                    analysis.username.includes(constants.IPLANT)
                                        ? analysis.username.split("@")[0]
                                        : analysis.username;
                                const isSelected = selected.indexOf(id) !== -1;
                                const rowId = build(baseId, tableId, id);
                                return (
                                    <TableRow
                                        onClick={(event) =>
                                            handleClick(event, id, index)
                                        }
                                        onMouseOver={() => {
                                            setMouseOverId(id);
                                        }}
                                        onMouseOut={() => {
                                            setMouseOverId("");
                                        }}
                                        onFocus={() => setMouseOverId(id)}
                                        onBlur={() => setMouseOverId("")}
                                        role="checkbox"
                                        aria-checked={isSelected}
                                        tabIndex={-1}
                                        selected={isSelected}
                                        hover
                                        key={id}
                                        id={rowId}
                                    >
                                        <TableCell padding="checkbox">
                                            <DECheckbox
                                                id={build(rowId, ids.CHECKBOX)}
                                                checked={isSelected}
                                                tabIndex={0}
                                                inputProps={{
                                                    "aria-label": formatMessage(
                                                        intl,
                                                        "ariaCheckbox",
                                                        {
                                                            label:
                                                                analysis.name,
                                                        }
                                                    ),
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            id={build(
                                                rowId + ids.ANALYSIS_NAME_CELL
                                            )}
                                        >
                                            <AnalysisName
                                                intl={intl}
                                                analysis={analysis}
                                                baseId={build(
                                                    rowId +
                                                        ids.ANALYSIS_NAME_CELL
                                                )}
                                                parentId={parentId}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Actions
                                                intl={intl}
                                                analysis={analysis}
                                                analysisUser={user}
                                                username={username}
                                                baseId={build(
                                                    rowId +
                                                        ids.ANALYSIS_ACTIONS_CELL
                                                )}
                                                handleInteractiveUrlClick={
                                                    handleInteractiveUrlClick
                                                }
                                                handleGoToOutputFolder={
                                                    handleGoToOutputFolder
                                                }
                                                handleBatchIconClick={
                                                    handleBatchIconClick
                                                }
                                                mouseOverId={mouseOverId}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">
                                                {user}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            id={build(rowId, ids.APP_NAME_CELL)}
                                        >
                                            <AppName analysis={analysis} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(analysis.startdate)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(analysis.enddate)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            id={build(rowId, ids.SUPPORT_CELL)}
                                        >
                                            <Status
                                                analysis={analysis}
                                                baseId={baseId}
                                                intl={intl}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                )}
            </Table>
        </TableContainer>
    );
}

export default withI18N(injectIntl(TableView), messages);
