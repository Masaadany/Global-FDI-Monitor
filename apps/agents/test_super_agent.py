"""Integration tests for GFM Super Agent"""
import asyncio, pytest, sys, os
sys.path.insert(0, os.path.dirname(__file__))

from super_agent import GFMSuperAgent, IntentClassifier, AgentLoader

class TestIntentClassifier:
    def setup_method(self):
        self.clf = IntentClassifier()

    def test_signal_detection_intent(self):
        intents = self.clf.classify("latest platinum FDI signals UAE")
        assert "signal_detection" in intents or "signals" in intents

    def test_report_intent(self):
        intents = self.clf.classify("generate market intelligence brief India")
        assert "report_generation" in intents or "report" in intents

    def test_gfr_intent(self):
        intents = self.clf.classify("GFR ranking score readiness")
        assert any(i in intents for i in ["gfr_computation","newsletter","ranking"])

    def test_forecast_intent(self):
        intents = self.clf.classify("forecast outlook predict 2030")
        assert any(i in intents for i in ["forecasting","signal_detection"])

    def test_dict_intent(self):
        intents = self.clf.classify({"intent":"gfr_computation","economy":"ARE"})
        assert intents == ["gfr_computation"]

    def test_job_routing(self):
        intents = self.clf.classify({"job":"signal-detection"})
        assert intents[0] == "signal_detection"

    def test_empty_falls_back(self):
        intents = self.clf.classify("xyz123 gibberish")
        assert len(intents) > 0

    def test_agents_for_intents(self):
        agents = self.clf.get_agents_for_intents(["signal_detection"])
        assert "signal_detector" in agents

    def test_multi_intent(self):
        intents = self.clf.classify("FDI signals and company profile analysis")
        assert len(intents) >= 1

    def test_mission_planning(self):
        intents = self.clf.classify("mission planning ipa promote target company")
        assert any(i in intents for i in ["mission_planning","ipa"])


class TestAgentLoader:
    def setup_method(self):
        self.loader = AgentLoader()

    def test_loads_signal_detector(self):
        mod = self.loader.load("agt02_signal_detector")
        assert mod is not None

    def test_loads_report_generator(self):
        mod = self.loader.load("agt05_report_generator")
        assert mod is not None

    def test_loads_mission_planner(self):
        mod = self.loader.load("agt06_mission_planner")
        assert mod is not None

    def test_loads_super_agent_module(self):
        mod = self.loader.load("super_agent")
        assert mod is not None

    def test_caches_loaded_module(self):
        mod1 = self.loader.load("agt02_signal_detector")
        mod2 = self.loader.load("agt02_signal_detector")
        assert mod1 is mod2

    def test_missing_module_returns_none(self):
        mod = self.loader.load("nonexistent_module_xyz")
        assert mod is None

    def test_loaded_count(self):
        loader = AgentLoader()
        assert loader.loaded_count == 0
        loader.load("agt02_signal_detector")
        assert loader.loaded_count == 1


class TestSuperAgent:
    def setup_method(self):
        self.agent = GFMSuperAgent()

    def test_health_returns_ok(self):
        async def run():
            return await self.agent.health()
        result = asyncio.run(run())
        assert result["status"] == "ok"
        assert result["agents_total"] >= 10

    def test_describe_returns_registry(self):
        desc = self.agent.describe()
        assert "agents" in desc
        assert desc["total_agents"] >= 10

    def test_run_signal_query(self):
        async def run():
            return await self.agent.run("platinum signals UAE technology", economy="ARE", sector="J")
        result = asyncio.run(run())
        assert "intents" in result
        assert "meta" in result
        assert result["meta"]["agents_queried"] >= 1

    def test_run_dict_intent(self):
        async def run():
            return await self.agent.run({"intent":"gfr_computation","economy":"ARE"})
        result = asyncio.run(run())
        assert result["intents"] == ["gfr_computation"]

    def test_run_scheduled_job(self):
        async def run():
            return await self.agent.run({"job":"signal-detection"})
        result = asyncio.run(run())
        assert result["job"] == "signal-detection"

    def test_run_unknown_job(self):
        async def run():
            return await self.agent.run({"job":"nonexistent-job"})
        result = asyncio.run(run())
        assert "error" in result or "available_jobs" in result

    def test_request_count_increments(self):
        async def run():
            await self.agent.run("test query 1")
            await self.agent.run("test query 2")
            return self.agent._request_count
        count = asyncio.run(run())
        assert count >= 2

    def test_elapsed_ms_in_meta(self):
        async def run():
            return await self.agent.run("signals for MENA")
        result = asyncio.run(run())
        assert result["meta"]["elapsed_ms"] >= 0

    def test_version(self):
        assert self.agent.VERSION is not None
        assert len(self.agent.VERSION) > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
