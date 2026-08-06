import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "EarnIt Privacy Policy | Box Automations",
  description:
    "Privacy Policy for the EarnIt Android application, including information about data collection, permissions, analytics, crash reporting, feedback, and data retention.",
};

const supportEmail = "kaleellawrenceboxx@gmail.com";

export default function EarnItPrivacyPage() {
  return (
    <main className="legal-page">
      <article className="legal-content">
        <header className="legal-header">
          <p className="legal-eyebrow">EarnIt</p>
          <h1>Privacy Policy</h1>

          <div className="legal-dates">
            <p>
              <strong>Effective date:</strong> August 6, 2026
            </p>
            <p>
              <strong>Last updated:</strong> August 6, 2026
            </p>
          </div>
        </header>

        <section>
          <h2>Overview</h2>

          <p>
            EarnIt is a productivity app that helps you manage your screen time
            by requiring productive app usage before accessing distracting apps.
            This policy explains what data EarnIt collects, why, and how it is
            handled.
          </p>

          <p>
            <strong>The short version:</strong> Almost everything EarnIt does
            stays on your device. We do not sell your data. We do not require an
            account. The only data that ever leaves your device is anonymous
            crash reports, anonymous product analytics, and feedback you choose
            to submit.
          </p>
        </section>

        <section>
          <h2>1. Data We Collect</h2>

          <h3>1.1 Data stored on your device only</h3>

          <p>
            The following data is created and stored entirely on your device. It
            is never transmitted to any server.
          </p>

          <div className="legal-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Purpose</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Your Rules (earn apps, blocked apps, schedules)</td>
                  <td>Core app functionality — blocking and unblocking apps</td>
                </tr>

                <tr>
                  <td>Reward time balances</td>
                  <td>
                    Tracking how much reward time you have earned and used
                  </td>
                </tr>

                <tr>
                  <td>App usage duration (via Android Usage Access)</td>
                  <td>
                    Calculating productive time earned; powering the Analytics
                    screen
                  </td>
                </tr>

                <tr>
                  <td>Daily commitments (Benjamin Franklin Mode)</td>
                  <td>
                    Storing the commitments you write for yourself each day
                  </td>
                </tr>

                <tr>
                  <td>Deep Work session state</td>
                  <td>Managing Deep Work focus sessions</td>
                </tr>

                <tr>
                  <td>Onboarding and setup progress</td>
                  <td>Remembering whether you have completed setup</td>
                </tr>

                <tr>
                  <td>Analytics history</td>
                  <td>Populating the Today and 7-day analytics views</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            <strong>
              We do not upload your app usage history, your Rules, your
              commitments, or your personal usage patterns to any server.
            </strong>
          </p>

          <h3>1.2 Anonymous installation identifier</h3>

          <p>
            When you first open EarnIt, a random UUID is generated and stored on
            your device. This identifier:
          </p>

          <ul>
            <li>
              Is not linked to your name, email, Apple ID, Google account, or
              any personally identifying information
            </li>
            <li>
              Is used only to de-duplicate crash reports and analytics events
              from the same device across sessions
            </li>
            <li>
              Is shared with PostHog (analytics) and Firebase Crashlytics (crash
              reporting) as described below
            </li>
          </ul>

          <p>
            You can reset this identifier by clearing the app&apos;s data in
            Android Settings.
          </p>

          <h3>1.3 Anonymous product analytics (PostHog)</h3>

          <p>
            EarnIt uses{" "}
            <a
              href="https://posthog.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostHog
            </a>{" "}
            to collect anonymous usage events. These events help us understand
            how the app is used so we can improve it.
          </p>

          <p>Examples of events collected:</p>

          <ul>
            <li>App opened, screens viewed</li>
            <li>Rule created or deleted</li>
            <li>Feedback submitted</li>
            <li>Onboarding steps completed</li>
          </ul>

          <p>
            <strong>What is NOT collected in analytics:</strong> the names of
            your apps, the content of your commitments, your personal usage
            amounts, or any content you type.
          </p>

          <p>
            PostHog&apos;s privacy policy:{" "}
            <a
              href="https://posthog.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://posthog.com/privacy
            </a>
          </p>

          <p>
            Data is associated only with your anonymous installation ID. PostHog
            is configured with <code>captureScreenViews = true</code> and
            automatic error tracking.
          </p>

          <h3>1.4 Crash reports (Firebase Crashlytics)</h3>

          <p>
            EarnIt uses{" "}
            <a
              href="https://firebase.google.com/products/crashlytics"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firebase Crashlytics
            </a>{" "}
            to automatically report app crashes. Crash reports include:
          </p>

          <ul>
            <li>The exception type and a sanitized stack trace</li>
            <li>Your anonymous installation ID</li>
            <li>Device model, Android version, and app version</li>
            <li>The screen or route where the crash occurred</li>
          </ul>

          <p>
            Crash reports do <strong>not</strong> include your Rules, usage
            data, commitments, or any other personal content.
          </p>

          <p>
            Firebase&apos;s privacy policy:{" "}
            <a
              href="https://firebase.google.com/support/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://firebase.google.com/support/privacy
            </a>
          </p>

          <h3>1.5 Feedback you voluntarily submit</h3>

          <p>
            If you choose to submit feedback through the in-app feedback form,
            we collect:
          </p>

          <ul>
            <li>Your feedback category (Bug, Suggestion, or Other)</li>
            <li>The message you write</li>
            <li>Your email address, if you choose to provide it (optional)</li>
            <li>A screenshot, if you choose to attach one (optional)</li>
            <li>
              Technical diagnostics: app version, Android version, device model,
              active rule count (not rule content), permission status, whether
              the device was online, your anonymous installation ID
            </li>
          </ul>

          <p>
            Feedback is submitted to our backend (Supabase) and used only to
            understand and respond to your report. If you provide an email
            address, we may reply to your feedback. We will not use your email
            for marketing.
          </p>

          <p>
            Feedback data is stored securely and deleted when no longer needed
            for support purposes.
          </p>
        </section>

        <section>
          <h2>2. Permissions We Request</h2>

          <div className="legal-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th scope="col">Permission</th>
                  <th scope="col">Why we need it</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    <strong>Accessibility Service</strong>
                  </td>
                  <td>
                    Required to detect which app is in the foreground so EarnIt
                    can enforce your Rules. EarnIt reads only the package name
                    of the foreground app — it does not read the content of any
                    app.
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Usage Access</strong> (
                    <code>PACKAGE_USAGE_STATS</code>)
                  </td>
                  <td>
                    Required to measure how long you spend in your productive
                    (Earn) apps, so we can calculate Reward Time earned. This
                    data stays on your device.
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Post Notifications</strong>
                  </td>
                  <td>
                    Used to send optional daily commitment reminders for
                    Benjamin Franklin Mode. You can disable these at any time in
                    your device&apos;s notification settings.
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Receive Boot Completed</strong>
                  </td>
                  <td>
                    Used to reschedule Benjamin Franklin Mode notification
                    reminders after your device restarts.
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Schedule Exact Alarm</strong>
                  </td>
                  <td>
                    Used to deliver Benjamin Franklin Mode reminders at your
                    chosen times.
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Internet</strong>
                  </td>
                  <td>
                    Used to submit feedback and send anonymous analytics events
                    and crash reports.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>3. Data Sharing</h2>

          <p>
            We do not sell your data. We do not share your data with advertisers
            or data brokers.
          </p>

          <p>
            Data is shared only with the following service providers, and only
            to the extent described in this policy:
          </p>

          <div className="legal-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th scope="col">Provider</th>
                  <th scope="col">Purpose</th>
                  <th scope="col">Data shared</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>PostHog</td>
                  <td>Anonymous product analytics</td>
                  <td>Anonymous events, installation ID</td>
                </tr>

                <tr>
                  <td>Firebase (Google)</td>
                  <td>Crash reporting</td>
                  <td>Crash diagnostics, installation ID</td>
                </tr>

                <tr>
                  <td>Supabase</td>
                  <td>Feedback storage</td>
                  <td>Feedback submissions (only when you submit feedback)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>All providers are used solely to operate and improve EarnIt.</p>
        </section>

        <section>
          <h2>4. Data Retention</h2>

          <div className="legal-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th scope="col">Data type</th>
                  <th scope="col">Retention</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>On-device data (Rules, usage, commitments)</td>
                  <td>Kept until you clear the app&apos;s data or uninstall</td>
                </tr>

                <tr>
                  <td>Anonymous analytics events</td>
                  <td>Retained by PostHog per their data retention settings</td>
                </tr>

                <tr>
                  <td>Crash reports</td>
                  <td>
                    Retained by Firebase Crashlytics per their data retention
                    settings
                  </td>
                </tr>

                <tr>
                  <td>Feedback submissions</td>
                  <td>
                    Retained as long as needed for support purposes, then
                    deleted
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>5. Children&apos;s Privacy</h2>

          <p>
            EarnIt is not directed at children under the age of 13. We do not
            knowingly collect personal information from children under 13. If
            you believe a child under 13 has submitted personal information
            through the feedback form, please contact us and we will delete it
            promptly.
          </p>
        </section>

        <section>
          <h2>6. Your Choices and Controls</h2>

          <ul>
            <li>
              <strong>Analytics:</strong> Anonymous analytics are enabled by
              default. If you wish to opt out, contact us at the email below and
              we will provide instructions.
            </li>

            <li>
              <strong>Crash reports:</strong> Crash reporting is enabled by
              default to help us fix bugs. If you wish to opt out, contact us.
            </li>

            <li>
              <strong>Feedback:</strong> Submitting feedback is entirely
              optional. Email and screenshot fields are optional within the
              form.
            </li>

            <li>
              <strong>Notifications:</strong> You can disable Benjamin Franklin
              Mode reminders at any time in Android Settings
              {" > "}Apps
              {" > "}EarnIt
              {" > "}Notifications.
            </li>

            <li>
              <strong>App data:</strong> You can clear all on-device data by
              going to Android Settings
              {" > "}Apps
              {" > "}EarnIt
              {" > "}Storage
              {" > "}Clear Data.
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Security</h2>

          <p>
            We take reasonable technical measures to protect the data we
            process:
          </p>

          <ul>
            <li>Feedback submissions are transmitted over HTTPS</li>
            <li>
              Analytics and crash reporting services use encrypted transport
            </li>
            <li>
              On-device data is protected by Android&apos;s standard app
              sandboxing
            </li>
          </ul>
        </section>

        <section>
          <h2>8. Changes to This Policy</h2>

          <p>
            We may update this policy from time to time. When we do, we will
            update the &quot;Last updated&quot; date at the top. If changes are
            significant, we will note them in the app&apos;s release notes.
            Continued use of EarnIt after changes constitutes your acceptance of
            the updated policy.
          </p>
        </section>

        <section>
          <h2>9. Contact</h2>

          <p>
            If you have questions about this privacy policy or want to make a
            data request, contact us at:
          </p>

          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </p>
        </section>

        <footer className="legal-footer">
          <p>
            <em>
              EarnIt is built by an independent developer. This policy applies
              to the EarnIt Android application.
            </em>
          </p>
        </footer>
      </article>
    </main>
  );
}
