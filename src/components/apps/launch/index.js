/**
 * @author psarando
 *
 * A component for displaying the App Launch Wizard for a given app.
 * Also handles calling analysis submission and quick-launch-save endpoints.
 */
import React from "react";

import { useRouter } from "next/router";
import { useMutation } from "react-query";

import NavigationConstants from "common/NavigationConstants";

import { useHomePath } from "components/data/utils";

import { useConfig } from "contexts/config";
import { useBootstrapInfo } from "contexts/bootstrap";

import { submitAnalysis } from "serviceFacades/analyses";
import { addQuickLaunch } from "serviceFacades/quickLaunches";

import AppLaunchWizard from "./AppLaunchWizard";
import WrappedErrorHandler from "../../utils/error/WrappedErrorHandler";

export default ({ app, launchError, loading }) => {
    const [submissionError, setSubmissionError] = React.useState(null);
    const [bootstrapInfo] = useBootstrapInfo();
    const [config] = useConfig();
    const homePath = useHomePath();

    const router = useRouter();

    const [submitAnalysisMutation] = useMutation(
        ({ submission }) => submitAnalysis(submission),
        {
            onSuccess: (resp, { onSuccess }) => {
                router.push(`/${NavigationConstants.ANALYSES}`);
                onSuccess(resp);
            },
            onError: (error, { onError }) => {
                onError(error);
                setSubmissionError(error);
            },
        }
    );

    const [addQuickLaunchMutation] = useMutation(
        ({ quickLaunch }) => addQuickLaunch(quickLaunch),
        {
            onSuccess: (resp, { onSuccess }) => {
                // TODO route to app details or QL listing page?
                onSuccess(resp);
            },
            onError: (error, { onError }) => {
                onError(error);
                setSubmissionError(error);
            },
        }
    );

    const preferences = bootstrapInfo?.preferences;

    const defaultOutputDir =
        preferences?.default_output_folder?.path ||
        preferences?.system_default_output_dir?.path ||
        (homePath && `${homePath}/analyses`) ||
        "";

    const notify = preferences?.enableAnalysisEmailNotification || false;

    const defaultMaxCPUCores = config?.tools?.private.max_cpu_limit;
    const defaultMaxMemory = config?.tools?.private.max_memory_limit;
    const defaultMaxDiskSpace = config?.tools?.private.max_disk_limit;

    const baseId = "apps";

    if (launchError) {
        return (
            <WrappedErrorHandler errorObject={launchError} baseId={baseId} />
        );
    }

    return (
        <AppLaunchWizard
            baseId={baseId}
            notify={notify}
            defaultOutputDir={defaultOutputDir}
            defaultMaxCPUCores={defaultMaxCPUCores}
            defaultMaxMemory={defaultMaxMemory}
            defaultMaxDiskSpace={defaultMaxDiskSpace}
            app={app}
            appError={submissionError}
            loading={loading}
            submitAnalysis={(submission, onSuccess, onError) => {
                setSubmissionError(null);
                submitAnalysisMutation({ submission, onSuccess, onError });
            }}
            saveQuickLaunch={(quickLaunch, onSuccess, onError) => {
                setSubmissionError(null);
                addQuickLaunchMutation({ quickLaunch, onSuccess, onError });
            }}
        />
    );
};
