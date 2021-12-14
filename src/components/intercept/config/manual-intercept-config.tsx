import * as React from 'react';
import { observer, inject, Observer } from 'mobx-react';

import { styled } from '../../../styles';

import { StatusPill } from '../intercept-option';
import { CopyableMonoValue } from '../../common/text-content';
import { ProxyStore } from '../../../model/proxy-store';

const InstructionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    user-select: text;
    margin-top: 5px;
`;

const InstructionsStep = styled.div`
    flex: 1 1 0;

    &:not(:last-child) {
        margin-right: 40px;
    }

    > h2 {
        font-size: ${p => p.theme.headingSize};
        margin-bottom: 21px;
    }

    > ol {
        list-style: decimal;

        > li {
            margin-left: 20px;
            margin-bottom: 10px;
        }
    }

    > p {
        line-height: 1.3;

        &:not(:last-child) {
            margin-bottom: 10px;
        }
    }

    strong {
        font-weight: bold;
    }

    a[href] {
        color: ${p => p.theme.linkColor};

        &:visited {
            color: ${p => p.theme.visitedLinkColor};
        }
    }
`;

const Nowrap = styled.span`
    white-space: nowrap;
`;

const ManualInterceptPill = inject('proxyStore')(observer(
    (p: {
        proxyStore?: ProxyStore,
        children?: React.ReactNode
    }) =>
        <StatusPill color='#4caf7d'>
            Proxy port: { p.proxyStore!.serverPort }
        </StatusPill>
));

const ManualInterceptConfig = inject('proxyStore')(
    (p: {
        proxyStore?: ProxyStore,
        children?: React.ReactNode,
        reportStarted: () => void
    }) => {
        // Report activation when first opened
        React.useEffect(() => p.reportStarted(), []);

        const { serverPort, certPath } = p.proxyStore!;

        return <Observer>{() =>
            <InstructionsContainer>
                <InstructionsStep>
                    <p>To intercept traffic you need to:</p>
                    <ol>
                        <li><strong>send your traffic via the HTTP Toolkit proxy</strong></li>
                        <li><strong>trust the certificate authority</strong> (if using HTTPS) </li>
                    </ol>
                    <p>
                        The steps to do this manually depend
                        on the client, but all the details
                        you'll need are shown here.
                    </p>
                    <p>
                        Want your client to be supported automatically? <Nowrap>
                            <a href='https://github.com/httptoolkit/httptoolkit/issues/new'>
                                Send some feedback
                            </a>
                        </Nowrap>.
                    </p>
                </InstructionsStep>

                <InstructionsStep>
                    <h2>1. Send traffic via HTTP Toolkit</h2>
                    <p>
                        To intercept an HTTP client on this machine, configure it to send traffic via{' '}
                        <CopyableMonoValue>http://localhost:{serverPort}</CopyableMonoValue>.
                    </p>
                    <p>
                        Most tools can be configured to do so by using the above address as an HTTP or
                        HTTPS proxy.
                    </p>
                    <p>
                        In other cases, it's also possible to forcibly reroute traffic
                        using networking tools like iptables.
                    </p>
                    <p>
                        Remote clients (e.g. phones) will need to use the IP address of this machine, not
                        localhost.
                    </p>
                </InstructionsStep>

                <InstructionsStep>
                    <h2>2. Trust the certificate authority</h2>
                    <p>
                        Optional: only required to intercept traffic that uses HTTPS, not plain HTTP.
                    </p>
                    <p>
                        HTTP Toolkit has generated a certificate authority (CA) on your machine,
                        and stored the certificate at <CopyableMonoValue>{ certPath }</CopyableMonoValue>.
                        All intercepted HTTPS exchanges use certificates from this CA.
                    </p>
                    <p>
                        To intercept HTTPS traffic you need to configure your HTTP client to
                        trust this certificate as a certificate authority, or temporarily
                        disable certificate checks entirely.
                    </p>
                </InstructionsStep>
            </InstructionsContainer>
        }</Observer>;
    }
);

export const ManualInterceptCustomUi = {
    rowHeight: 1,
    columnWidth: 4,
    configComponent: ManualInterceptConfig,
    customPill: ManualInterceptPill
};