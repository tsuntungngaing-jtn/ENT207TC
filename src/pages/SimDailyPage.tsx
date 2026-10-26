import { TopBar } from '../components/layout/TopBar'
import { Page, Panel, SectionTitle } from '../components/ui/Primitives'

/** Stub until Task 5. */
export function SimDailyPage() {
  return (
    <>
      <TopBar title="Daily Log" subtitle="Coming in Task 5" />
      <Page>
        <div className="mx-auto max-w-7xl animate-fade-up">
          <Panel>
            <SectionTitle title="Daily" subtitle="Committed day history and alerts" />
            <p className="text-sm text-slate-600">Coming in Task 5.</p>
          </Panel>
        </div>
      </Page>
    </>
  )
}
