import os
from typing import Any, Dict, List, Optional

import asyncpg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/student")


async def create_pool():
    """Create and return an asyncpg pool."""
    return await asyncpg.create_pool(DATABASE_URL)


async def fetch_all(pool: asyncpg.pool.Pool, query: str, *args) -> List[Dict[str, Any]]:
    async with pool.acquire() as conn:
        rows = await conn.fetch(query, *args)
        return [dict(r) for r in rows]


async def fetch_one(pool: asyncpg.pool.Pool, query: str, *args) -> Optional[Dict[str, Any]]:
    async with pool.acquire() as conn:
        row = await conn.fetchrow(query, *args)
        return dict(row) if row else None
