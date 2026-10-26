import { TopBar } from '../components/layout/TopBar'
import { Page, Panel, SectionTitle } from '../components/ui/Primitives'

/** Stub until Task 4. */
export function SimDispatchPage() {
  return (
    <>
      <TopBar title="Dispatch Board" subtitle="Coming in Task 4" />
      <Page>
        <div className="mx-auto max-w-7xl animate-fade-up">
          <Panel>
            <SectionTitle title="Dispatch" subtitle="Pricing and channel dispatch board" />
            <p className="text-sm text-slate-600">Coming in Task 4.</p>
          </Panel>
        </div>
      </Page>
    </>
  )
}
