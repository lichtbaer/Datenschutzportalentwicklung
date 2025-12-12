import pytest
from app.services.nextcloud import NextcloudService

@pytest.mark.asyncio
async def test_nextcloud_service_initialization():
    """
    Test that NextcloudService can be initialized.
    This verifies that settings are correctly loaded and client is instantiated.
    """
    try:
        service = NextcloudService()
        assert service.client is not None
    except Exception as e:
        pytest.fail(f"Failed to initialize NextcloudService: {e}")
